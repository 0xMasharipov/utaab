import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LessonRow {
  id: string;
  order_index: number;
  duration_minutes: number | null;
}

interface ProgressRow {
  lesson_id: string;
  progress_percentage: number | null;
  completed: boolean | null;
  watch_time_seconds: number | null;
}

const COMPLETE_AT = 95;
const SAVE_EVERY_MS = 10_000;

/**
 * Tracks per-lesson watch progress for a course identified by slug.
 * Lessons are matched to on-page items through `order_index`.
 */
export const useCourseProgress = (slug: string) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const lastSavedAt = useRef<Record<string, number>>({});
  const enrolling = useRef(false);
  const requesting = useRef(false);

  // Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Course + lessons
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (cancelled || !course) return;
      setCourseId(course.id);

      const { data: rows } = await supabase
        .from('lessons')
        .select('id, order_index, duration_minutes')
        .eq('course_id', course.id)
        .order('order_index', { ascending: true });
      if (!cancelled) setLessons((rows as LessonRow[]) ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Existing progress + enrollment
  const refreshProgress = useCallback(async () => {
    if (!userId || lessons.length === 0) return;
    const ids = lessons.map((l) => l.id);
    const { data } = await supabase
      .from('lesson_progress')
      .select('lesson_id, progress_percentage, completed, watch_time_seconds')
      .eq('user_id', userId)
      .in('lesson_id', ids);
    const map: Record<string, ProgressRow> = {};
    (data ?? []).forEach((r) => {
      map[r.lesson_id] = r as ProgressRow;
    });
    setProgress(map);
  }, [userId, lessons]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  useEffect(() => {
    if (!userId || !courseId) return;
    supabase
      .from('certificate_requests')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setCourseCompleted(true);
      });
  }, [userId, courseId]);

  const lessonIdFor = useCallback(
    (orderIndex: number) => lessons.find((l) => l.order_index === orderIndex)?.id ?? null,
    [lessons],
  );

  const completedOrderIndexes = lessons
    .filter((l) => progress[l.id]?.completed)
    .map((l) => l.order_index);

  const resumeSecondsFor = useCallback(
    (orderIndex: number) => {
      const id = lessonIdFor(orderIndex);
      if (!id) return 0;
      const row = progress[id];
      if (!row || row.completed) return 0;
      return row.watch_time_seconds ?? 0;
    },
    [lessonIdFor, progress],
  );

  const ensureEnrolled = useCallback(async () => {
    if (!userId || !courseId || enrolling.current) return;
    enrolling.current = true;
    try {
      const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();
      if (!data) {
        await supabase.from('enrollments').insert({ user_id: userId, course_id: courseId });
      }
    } finally {
      enrolling.current = false;
    }
  }, [userId, courseId]);

  const requestCertificate = useCallback(async () => {
    if (!courseId || requesting.current || courseCompleted) return;
    requesting.current = true;
    try {
      const { data } = await supabase.functions.invoke('request-course-certificate', {
        body: { course_id: courseId },
      });
      if (data?.requested) {
        setCourseCompleted(true);
        setJustCompleted(true);
      }
    } catch (e) {
      console.error('certificate request failed', e);
    } finally {
      requesting.current = false;
    }
  }, [courseId, courseCompleted]);

  /** Persist watch progress for a lesson (throttled unless `force`). */
  const saveProgress = useCallback(
    async (orderIndex: number, percent: number, currentTime: number, force = false) => {
      const lessonId = lessonIdFor(orderIndex);
      if (!userId || !lessonId || !Number.isFinite(percent)) return;

      const now = Date.now();
      const alreadyCompleted = progress[lessonId]?.completed === true;
      const willComplete = percent >= COMPLETE_AT && !alreadyCompleted;
      if (!force && !willComplete && now - (lastSavedAt.current[lessonId] ?? 0) < SAVE_EVERY_MS) return;
      lastSavedAt.current[lessonId] = now;

      await ensureEnrolled();

      const completed = alreadyCompleted || percent >= COMPLETE_AT;
      const { error } = await supabase.from('lesson_progress').upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          progress_percentage: Math.min(100, Math.round(percent * 100) / 100),
          watch_time_seconds: Math.round(currentTime),
          completed,
          last_watched_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' },
      );
      if (error) {
        console.error('progress save failed', error);
        return;
      }

      setProgress((prev) => ({
        ...prev,
        [lessonId]: {
          lesson_id: lessonId,
          progress_percentage: percent,
          completed,
          watch_time_seconds: Math.round(currentTime),
        },
      }));

      if (willComplete) {
        const completedCount = lessons.filter(
          (l) => l.id === lessonId || progress[l.id]?.completed,
        ).length;
        if (completedCount >= lessons.length && lessons.length > 0) {
          // Update overall enrollment progress, then ask the server for a certificate.
          if (courseId) {
            await supabase
              .from('enrollments')
              .update({ progress: 100 })
              .eq('user_id', userId)
              .eq('course_id', courseId);
          }
          await requestCertificate();
        } else if (courseId) {
          await supabase
            .from('enrollments')
            .update({ progress: Math.round((completedCount / lessons.length) * 100) })
            .eq('user_id', userId)
            .eq('course_id', courseId);
        }
      }
    },
    [userId, courseId, lessonIdFor, progress, lessons, ensureEnrolled, requestCertificate],
  );

  return {
    userId,
    authReady,
    isSignedIn: !!userId,
    courseId,
    totalLessons: lessons.length,
    completedOrderIndexes,
    resumeSecondsFor,
    saveProgress,
    ensureEnrolled,
    courseCompleted,
    justCompleted,
    setJustCompleted,
  };
};
