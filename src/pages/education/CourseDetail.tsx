import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Clock, Users, Globe, BookOpen, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { CutiiAIPanel } from '@/components/education/CutiiAIPanel';
import { CourseReviews } from '@/components/education/CourseReviews';
import { SafeContent } from '@/components/common/SafeContent';
import AnimatedImage from '@/components/common/AnimatedImage';

export const CourseDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, instructors(*), categories(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', course?.id, user?.id],
    queryFn: async () => {
      if (!course?.id || !user?.id) return null;
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', course.id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      setIsEnrolled(!!data);
      return data;
    },
    enabled: !!course?.id && !!user?.id,
  });

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to enroll in courses",
        variant: "destructive",
      });
      navigate('/education/register');
      return;
    }

    if (!course) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast({
        title: "Success!",
        description: "You've been enrolled in the course",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCourseTitle = (course: any) => {
    const locale = i18n.language;
    return course[`title_${locale}`] || course.title_en;
  };

  const getCourseDescription = (course: any) => {
    const locale = i18n.language;
    return course[`description_${locale}`] || course.description_en;
  };

  const getCourseOutcomes = (course: any) => {
    const locale = i18n.language;
    return course[`outcomes_${locale}`] || course.outcomes_en || [];
  };

  const getCoursePrerequisites = (course: any) => {
    const locale = i18n.language;
    return course[`prerequisites_${locale}`] || course.prerequisites_en || [];
  };

  const getCategoryName = (category: any) => {
    const locale = i18n.language;
    return category[`name_${locale}`] || category.name_en;
  };

  const getInstructorBio = (instructor: any) => {
    const locale = i18n.language;
    return instructor[`bio_${locale}`] || instructor.bio_en;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => navigate('/education/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  // Prepare context for CUTII AI
  const courseContext = course ? {
    id: course.id,
    title: getCourseTitle(course),
    level: course.level,
    topics: course.tags || [],
  } : undefined;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <EducationNavbar />
      <CutiiAIPanel courseContext={courseContext} />
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {course.categories && (
                  <Badge variant="secondary">{getCategoryName(course.categories)}</Badge>
                )}
                <Badge variant="outline">{t(`education.levels.${course.level}`)}</Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {getCourseTitle(course)}
              </h1>
              
              <SafeContent 
                content={getCourseDescription(course)}
                className="text-xl text-muted-foreground mb-6"
                as="p"
              />

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.total_reviews} {t('education.course.reviews')})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.total_enrollments} {t('education.course.students')}</span>
                </div>
                {course.duration_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{course.duration_hours} {t('education.catalog.hours')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>{course.language.toUpperCase()}</span>
                </div>
              </div>

              {/* Instructor */}
              {course.instructors && (
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                    {course.instructors.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('education.course.instructor')}</p>
                    <p className="text-lg font-semibold">{course.instructors.name}</p>
                    {course.instructors.title && (
                      <p className="text-sm text-muted-foreground">{course.instructors.title}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="glass sticky top-24">
                <CardContent className="p-6">
                  {course.hero_image && (
                    <div className="aspect-video overflow-hidden rounded-lg mb-4">
                      <AnimatedImage
                        src={course.hero_image}
                        alt={getCourseTitle(course)}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-primary">
                      {course.is_free ? t('education.course.price_free') : `$${course.price}`}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <Button className="w-full btn-primary" size="lg">
                      <Play className="mr-2 h-5 w-5" />
                      {t('education.course.continue')}
                    </Button>
                  ) : (
                    <Button onClick={handleEnroll} className="w-full btn-primary" size="lg">
                      {t('education.course.enroll')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {getCourseOutcomes(course).length > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t('education.course.what_learn')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getCourseOutcomes(course).map((outcome: string, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {getCoursePrerequisites(course).length > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t('education.course.prerequisites')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {getCoursePrerequisites(course).map((prereq: string, idx: number) => (
                      <li key={idx}>{prereq}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Course Description */}
            {getCourseDescription(course) && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent>
                  <SafeContent 
                    content={getCourseDescription(course)}
                    className="text-muted-foreground whitespace-pre-line"
                    as="p"
                  />
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <CourseReviews courseId={course.id} isEnrolled={isEnrolled} />

            {/* Instructor Bio */}
            {course.instructors && getInstructorBio(course.instructors) && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t('education.course.instructor')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl flex-shrink-0">
                      {course.instructors.name.charAt(0)}
                    </div>
                  <div>
                    <h3 className="text-xl font-semibold">{course.instructors.name}</h3>
                    {course.instructors.title && (
                      <p className="text-muted-foreground">{course.instructors.title}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{course.instructors.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.instructors.total_students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.instructors.total_courses}</span>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2"
                      onClick={() => navigate(`/education/instructor/${course.instructors.id}`)}
                    >
                      View Profile →
                    </Button>
                  </div>
                  </div>
                  <SafeContent 
                    content={getInstructorBio(course.instructors)}
                    className="text-muted-foreground whitespace-pre-line"
                    as="p"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <Card className="glass mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
