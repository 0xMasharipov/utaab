import { useTranslation } from 'react-i18next';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Lesson {
  id: string;
  title_en: string;
  title_tr: string;
  title_ru: string;
  title_ar: string;
  duration_minutes: number;
  is_free: boolean;
  order_index: number;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  progress_percentage: number;
}

interface LessonNavigationProps {
  lessons: Lesson[];
  progress: LessonProgress[];
  currentLessonId: string;
  isEnrolled: boolean;
  onLessonSelect: (lessonId: string) => void;
}

export const LessonNavigation = ({
  lessons,
  progress,
  currentLessonId,
  isEnrolled,
  onLessonSelect
}: LessonNavigationProps) => {
  const { i18n } = useTranslation();

  const getLessonTitle = (lesson: Lesson) => {
    const lang = i18n.language;
    if (lang === 'tr') return lesson.title_tr || lesson.title_en;
    if (lang === 'ru') return lesson.title_ru || lesson.title_en;
    if (lang === 'ar') return lesson.title_ar || lesson.title_en;
    return lesson.title_en;
  };

  const getLessonProgress = (lessonId: string) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const isLessonAccessible = (lesson: Lesson) => {
    return lesson.is_free || isEnrolled;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-2">
            {lessons
              .sort((a, b) => a.order_index - b.order_index)
              .map((lesson, index) => {
                const lessonProgress = getLessonProgress(lesson.id);
                const accessible = isLessonAccessible(lesson);
                const isCurrent = lesson.id === currentLessonId;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => accessible && onLessonSelect(lesson.id)}
                    disabled={!accessible}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-colors',
                      'flex items-start gap-3',
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : accessible
                        ? 'hover:bg-accent cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {!accessible ? (
                        <Lock className="h-4 w-4" />
                      ) : lessonProgress?.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {index + 1}. {getLessonTitle(lesson)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <span>{lesson.duration_minutes} min</span>
                        {lessonProgress && !lessonProgress.completed && (
                          <span>• {Math.round(lessonProgress.progress_percentage)}%</span>
                        )}
                        {lesson.is_free && (
                          <span className="text-green-500">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
