import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { VideoPlayer } from '@/components/learning/VideoPlayer';
import { LessonNavigation } from '@/components/learning/LessonNavigation';
import { QuizSystem } from '@/components/learning/QuizSystem';
import { CertificateDisplay } from '@/components/learning/CertificateDisplay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award } from 'lucide-react';
import { toast } from 'sonner';

export const CourseLearn = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('lesson');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const { data: course } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', course?.id, user?.id],
    queryFn: async () => {
      if (!user || !course) return null;
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!course
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons', course?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course!.id)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!course
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['lesson-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: currentQuiz } = useQuery({
    queryKey: ['quiz', currentLessonId],
    queryFn: async () => {
      if (!currentLessonId) return null;
      
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', currentLessonId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? {
        ...data,
        questions: data.questions as any
      } : null;
    },
    enabled: !!currentLessonId
  });

  const { data: certificate } = useQuery({
    queryKey: ['certificate', course?.id, user?.id],
    queryFn: async () => {
      if (!user || !course) return null;
      
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user && !!course
  });

  useEffect(() => {
    if (lessons.length > 0 && !currentLessonId) {
      const lastWatchedLesson = progress
        .filter(p => lessons.some(l => l.id === p.lesson_id))
        .sort((a, b) => new Date(b.last_watched_at || 0).getTime() - new Date(a.last_watched_at || 0).getTime())[0];
      
      setCurrentLessonId(lastWatchedLesson?.lesson_id || lessons[0].id);
    }
  }, [lessons, progress, currentLessonId]);

  const checkAndIssueCertificate = async () => {
    if (!user || !course || certificate) return;

    const allLessonsCompleted = lessons.every(lesson => {
      const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
      return lessonProgress?.completed;
    });

    if (allLessonsCompleted && enrollment?.progress === 100) {
      const certNumber = await supabase.rpc('generate_certificate_number');
      
      const { error } = await supabase.from('certificates').insert({
        user_id: user.id,
        course_id: course.id,
        certificate_number: certNumber.data
      });

      if (!error) {
        toast.success('Congratulations! Your certificate has been issued!');
        setActiveTab('certificate');
      }
    }
  };

  const handleProgressUpdate = async (lessonProgress: number) => {
    if (!course || !user) return;

    const completedLessons = progress.filter(p => p.completed).length;
    const totalProgress = Math.round((completedLessons / lessons.length) * 100);

    await supabase
      .from('enrollments')
      .update({ progress: totalProgress })
      .eq('user_id', user.id)
      .eq('course_id', course.id);

    if (totalProgress === 100) {
      checkAndIssueCertificate();
    }
  };

  if (!user) {
    return <Navigate to="/education/register" />;
  }

  if (!course || !currentLessonId) {
    return (
      <div className="min-h-screen bg-background">
        <EducationNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const currentLesson = lessons.find(l => l.id === currentLessonId);
  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-background">
      <EducationNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="lesson">Lesson</TabsTrigger>
                {currentQuiz && <TabsTrigger value="quiz">Quiz</TabsTrigger>}
                {certificate && (
                  <TabsTrigger value="certificate" className="gap-2">
                    <Award className="h-4 w-4" />
                    Certificate
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="lesson" className="space-y-4">
                {currentLesson?.video_url && (
                  <VideoPlayer
                    videoUrl={currentLesson.video_url}
                    lessonId={currentLessonId}
                    onProgressUpdate={handleProgressUpdate}
                  />
                )}
                
                <div className="prose max-w-none">
                  <h2>
                    {i18n.language === 'tr' && currentLesson?.title_tr
                      ? currentLesson.title_tr
                      : i18n.language === 'ru' && currentLesson?.title_ru
                      ? currentLesson.title_ru
                      : i18n.language === 'ar' && currentLesson?.title_ar
                      ? currentLesson.title_ar
                      : currentLesson?.title_en}
                  </h2>
                  <p>
                    {i18n.language === 'tr' && currentLesson?.description_tr
                      ? currentLesson.description_tr
                      : i18n.language === 'ru' && currentLesson?.description_ru
                      ? currentLesson.description_ru
                      : i18n.language === 'ar' && currentLesson?.description_ar
                      ? currentLesson.description_ar
                      : currentLesson?.description_en}
                  </p>
                </div>
              </TabsContent>

              {currentQuiz && (
                <TabsContent value="quiz">
                  <QuizSystem
                    quiz={currentQuiz}
                    onComplete={(passed) => {
                      if (passed) {
                        setActiveTab('lesson');
                        toast.success('Great job! Continue to the next lesson.');
                      }
                    }}
                  />
                </TabsContent>
              )}

              {certificate && (
                <TabsContent value="certificate">
                  <CertificateDisplay
                    certificate={{
                      ...certificate,
                      course_title: course.title_en,
                      student_name: user.email || 'Student'
                    }}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <LessonNavigation
              lessons={lessons}
              progress={progress}
              currentLessonId={currentLessonId}
              isEnrolled={isEnrolled}
              onLessonSelect={setCurrentLessonId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
