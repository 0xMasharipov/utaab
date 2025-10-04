import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { EducationNavbar } from '@/components/education/EducationNavbar';

export const CourseCatalog = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

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

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', searchQuery, selectedCategory, selectedLevel, selectedLanguage, selectedPrice, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*, instructors(*), categories(*)')
        .eq('is_published', true);

      // Apply filters
      if (selectedCategory !== 'all') {
        const category = categories?.find(c => c.slug === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (selectedLevel !== 'all') {
        query = query.eq('level', selectedLevel as any);
      }

      if (selectedLanguage !== 'all') {
        query = query.eq('language', selectedLanguage as any);
      }

      if (selectedPrice === 'free') {
        query = query.eq('is_free', true);
      } else if (selectedPrice === 'paid') {
        query = query.eq('is_free', false);
      }

      // Apply sorting
      if (sortBy === 'popular') {
        query = query.order('total_enrollments', { ascending: false });
      } else if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'highest_rated') {
        query = query.order('rating', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Apply search filter client-side for multilingual support
      if (searchQuery.trim()) {
        const locale = i18n.language;
        return data.filter((course) => {
          const title = course[`title_${locale}`] || course.title_en;
          const subtitle = course[`subtitle_${locale}`] || course.subtitle_en;
          const searchLower = searchQuery.toLowerCase();
          return (
            title.toLowerCase().includes(searchLower) ||
            subtitle?.toLowerCase().includes(searchLower) ||
            course.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
          );
        });
      }

      return data;
    },
  });

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedLanguage('all');
    setSelectedPrice('all');
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    selectedLanguage !== 'all',
    selectedPrice !== 'all',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <EducationNavbar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('education.catalog.title')}</h1>
          
          {/* Search and Filter Toggle */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('education.home.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="glass"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              {t('education.catalog.filters')}
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="glass mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder={t('education.catalog.all_courses')} />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      <SelectItem value="all">{t('education.catalog.all_courses')}</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {getCategoryName(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Level Filter */}
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder={t('education.catalog.level')} />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      <SelectItem value="all">{t('education.catalog.all_levels')}</SelectItem>
                      <SelectItem value="beginner">{t('education.levels.beginner')}</SelectItem>
                      <SelectItem value="intermediate">{t('education.levels.intermediate')}</SelectItem>
                      <SelectItem value="advanced">{t('education.levels.advanced')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Language Filter */}
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder={t('education.catalog.language')} />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      <SelectItem value="all">{t('education.catalog.all_languages')}</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Price Filter */}
                  <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder={t('education.catalog.price')} />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      <SelectItem value="all">{t('education.catalog.all_courses')}</SelectItem>
                      <SelectItem value="free">{t('education.catalog.free')}</SelectItem>
                      <SelectItem value="paid">{t('education.catalog.paid')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeFiltersCount > 0 && (
                  <Button variant="ghost" onClick={clearFilters} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    {t('education.catalog.clear_filters')}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sort and Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {courses?.length || 0} {courses?.length === 1 ? t('education.catalog.course') : t('education.catalog.courses')}
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="glass w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong">
                <SelectItem value="popular">{t('education.catalog.popular')}</SelectItem>
                <SelectItem value="newest">{t('education.catalog.newest')}</SelectItem>
                <SelectItem value="highest_rated">{t('education.catalog.highest_rated')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : courses && courses.length > 0 ? (
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
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {course.instructors.name.charAt(0)}
                      </div>
                      <span className="text-muted-foreground">{course.instructors.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                      {course.duration_hours && (
                        <span>{course.duration_hours} {t('education.catalog.hours')}</span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {course.is_free ? t('education.course.price_free') : `$${course.price}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">{t('education.catalog.no_results')}</p>
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} className="mt-4" variant="outline">
                {t('education.catalog.clear_filters')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
