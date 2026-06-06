import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, ArrowRight, BookMarked, GraduationCap, Star,
  Boxes, Coins, Image as ImageIcon, Globe, FileCode2, ShieldCheck, TrendingUp, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { CutiiAIPanel } from '@/components/education/CutiiAIPanel';
import { ExternalCourseCard } from '@/components/education/ExternalCourseCard';
import { externalCourses } from '@/data/externalCourses';
import AnimatedImage from '@/components/common/AnimatedImage';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import BottomGradientOverlay from '@/components/BottomGradientOverlay';

const categoryIconFor = (slug?: string) => {
  switch (slug) {
    case 'blockchain': return Boxes;
    case 'defi': return Coins;
    case 'nft': return ImageIcon;
    case 'web3': return Globe;
    case 'smart-contracts': return FileCode2;
    case 'security': return ShieldCheck;
    case 'trading': return TrendingUp;
    default: return BookOpen;
  }
};

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
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatedBlobBackground />
      <EducationNavbar />
      <CutiiAIPanel />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="section-container relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge variant="outline" className="glass border-accent/30 text-accent mb-6 px-4 py-1.5 text-xs tracking-wider uppercase">
              {t('education.home.hero_badge')}
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('education.home.hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('education.home.hero_subtitle')}
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto animate-fade-in mb-8" style={{ animationDelay: '0.2s' }}>
              <Input
                type="text"
                placeholder={t('education.home.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="glass h-14 text-lg"
              />
              <Button onClick={handleSearch} size="lg" className="btn-primary h-14 px-5" aria-label={t('education.home.search_placeholder')}>
                <Search className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{t('education.home.search_placeholder')}</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={() => navigate('/education/courses')} size="lg" className="btn-primary rounded-full">
                {t('education.home.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate('/education/courses')}
                size="lg"
                variant="outline"
                className="glass border-white/15 rounded-full"
              >
                {t('education.home.browse_catalog')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Open Educational Resources Section */}
      <section className="py-20 px-6">
        <div className="section-container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 border border-accent/20 text-accent mb-4">
              <BookMarked className="h-5 w-5" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t('education.home.open_resources')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              {t('education.home.open_resources_subtitle')}
            </p>
            <Badge variant="outline" className="glass border-accent/30 text-accent gap-1.5">
              <GraduationCap className="h-4 w-4" />
              {t('education.home.mit_partnership')}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalCourses.map((course) => (
              <ExternalCourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(course.externalUrl)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-20 px-6">
          <div className="section-container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t('education.home.categories')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const Icon = categoryIconFor(category.slug);
                return (
                  <GlassCard
                    key={category.id}
                    hover
                    className="cursor-pointer p-6 text-center"
                    onClick={() => navigate(`/education/courses?category=${category.slug}`)}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 border border-accent/20 text-accent mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{getCategoryName(category)}</h3>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      {featuredCourses && featuredCourses.length > 0 && (
        <section className="py-20 px-6">
          <div className="section-container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t('education.home.featured')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <GlassCard
                  key={course.id}
                  hover
                  className="cursor-pointer overflow-hidden p-0"
                  onClick={() => navigate(`/education/course/${course.slug}`)}
                >
                  {course.hero_image && (
                    <div className="aspect-video overflow-hidden">
                      <AnimatedImage
                        src={course.hero_image}
                        alt={getCourseTitle(course)}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {course.categories && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/15 border border-accent/20 text-accent">
                          {getCategoryName(course.categories)}
                        </span>
                      )}
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {t(`education.levels.${course.level}`)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{getCourseTitle(course)}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {getCourseSubtitle(course)}
                    </p>
                    {course.instructors && (
                      <div
                        className="flex items-center gap-2 text-sm mb-4 cursor-pointer hover:text-accent transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/education/instructor/${course.instructors.id}`);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/15 border border-accent/20 text-accent flex items-center justify-center font-semibold">
                          {course.instructors.name.charAt(0)}
                        </div>
                        <span className="text-muted-foreground hover:text-foreground">{course.instructors.name}</span>
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-semibold">{course.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-lg font-bold text-accent">
                        {course.is_free ? t('education.course.price_free') : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      <BottomGradientOverlay />
    </div>
  );
};
