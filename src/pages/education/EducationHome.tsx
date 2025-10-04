import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { CutiiAIPanel } from '@/components/education/CutiiAIPanel';

export const EducationHome = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    },
  });

  const { data: featuredCourses } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, instructors(*), categories(*)')
        .eq('is_published', true)
        .eq('featured', true)
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/education/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getCategoryName = (category: any) => {
    const locale = i18n.language;
    return category[`name_${locale}`] || category.name_en;
  };

  const getCourseTitle = (course: any) => {
    const locale = i18n.language;
    return course[`title_${locale}`] || course.title_en;
  };

  const getCourseSubtitle = (course: any) => {
    const locale = i18n.language;
    return course[`subtitle_${locale}`] || course.subtitle_en;
  };

  return (
    <div className="min-h-screen bg-background">
      <EducationNavbar />
      <CutiiAIPanel />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('education.home.hero_title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('education.home.hero_subtitle')}
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Input
                type="text"
                placeholder={t('education.home.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="glass h-14 text-lg"
              />
              <Button onClick={handleSearch} size="lg" className="btn-primary">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={() => navigate('/education/courses')} size="lg" className="btn-primary">
              {t('education.home.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">{t('education.home.categories')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="glass cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                  onClick={() => navigate(`/education/courses?category=${category.slug}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">
                      {category.icon || '📚'}
                    </div>
                    <h3 className="text-xl font-semibold">{getCategoryName(category)}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      {featuredCourses && featuredCourses.length > 0 && (
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">{t('education.home.featured')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
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
                    <div className="flex items-center gap-2 mb-2">
                      {course.categories && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {getCategoryName(course.categories)}
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {t(`education.levels.${course.level}`)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{getCourseTitle(course)}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {getCourseSubtitle(course)}
                    </p>
                    {course.instructors && (
                      <div 
                        className="flex items-center gap-2 text-sm mb-4 cursor-pointer hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/education/instructor/${course.instructors.id}`);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          {course.instructors.name.charAt(0)}
                        </div>
                        <span className="text-muted-foreground hover:text-foreground">{course.instructors.name}</span>
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
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
        </section>
      )}
    </div>
  );
};
