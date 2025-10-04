import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Users, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const InstructorProfile = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data: instructor, isLoading } = useQuery({
    queryKey: ['instructor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: courses } = useQuery({
    queryKey: ['instructor-courses', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, categories(*)')
        .eq('instructor_id', id)
        .eq('is_published', true);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const getInstructorBio = (instructor: any) => {
    const locale = i18n.language;
    return instructor[`bio_${locale}`] || instructor.bio_en;
  };

  const getCourseTitle = (course: any) => {
    const locale = i18n.language;
    return course[`title_${locale}`] || course.title_en;
  };

  const getCategoryName = (category: any) => {
    const locale = i18n.language;
    return category[`name_${locale}`] || category.name_en;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <EducationNavbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <EducationNavbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Instructor not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <EducationNavbar />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Instructor Header */}
        <Card className="glass mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-5xl flex-shrink-0">
                {instructor.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
                {instructor.title && (
                  <p className="text-xl text-muted-foreground mb-4">{instructor.title}</p>
                )}
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">{instructor.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">{instructor.total_students.toLocaleString()}</span>
                    <span className="text-muted-foreground">Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-semibold">{instructor.total_courses}</span>
                    <span className="text-muted-foreground">Courses</span>
                  </div>
                </div>

                {getInstructorBio(instructor) && (
                  <p className="text-muted-foreground whitespace-pre-line">
                    {getInstructorBio(instructor)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructor's Courses */}
        {courses && courses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Courses by {instructor.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="glass cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden"
                  onClick={() => navigate(`/education/course/${course.slug}`)}
                >
                  {course.hero_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={course.hero_image}
                        alt={getCourseTitle(course)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    {course.categories && (
                      <Badge variant="secondary" className="mb-2">
                        {getCategoryName(course.categories)}
                      </Badge>
                    )}
                    <h3 className="text-xl font-semibold mb-2">{getCourseTitle(course)}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold">{course.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {course.is_free ? t('education.course.price_free') : `$${course.price}`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
