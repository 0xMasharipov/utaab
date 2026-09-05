import { useState } from 'react';
import { ArrowRight, Search, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EducationNavbar } from '@/components/education/EducationNavbar';
import { CutiiAIPanel } from '@/components/education/CutiiAIPanel';
import { ExternalCourseCard } from '@/components/education/ExternalCourseCard';
import { externalCourses } from '@/data/externalCourses';
import AnimatedImage from '@/components/common/AnimatedImage';

export const EducationHome = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name_en');
      if (error) throw error;
      return data;
    },
  });

  const {
    data: featuredCourses,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery({
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
    const query = searchQuery.trim();
    navigate(query ? `/education/courses?search=${encodeURIComponent(query)}` : '/education/courses');
  };

  const localized = (record: Record<string, unknown> | null | undefined, field: string) => {
    const locale = i18n.language.split('-')[0];
    const value = record?.[`${field}_${locale}`] || record?.[`${field}_en`] || '';
    return typeof value === 'string' ? value : String(value);
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <EducationNavbar />
      <CutiiAIPanel />

      <main className="relative z-10 px-5 pb-28 pt-28 sm:px-8 lg:pb-36 lg:pt-32">
        <section className="mx-auto grid max-w-7xl items-end gap-12 border-b border-white/10 pb-20 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20 lg:pb-24">
          <div>
            <p className="mb-5 text-sm font-semibold text-accent">{t('education.home.hero_badge')}</p>
            <h1 className="max-w-[12ch] text-balance text-[clamp(3rem,7vw,6.9rem)] font-extrabold leading-[0.91] tracking-[-0.075em]">
              {t('education.home.hero_title')}
            </h1>
          </div>
          <div className="pb-1">
            <p className="max-w-[36rem] text-pretty text-base font-medium leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {t('education.home.hero_subtitle')}
            </p>
            <form
              className="mt-8 flex max-w-xl flex-col items-stretch gap-3 border-b border-white/25 pb-3 focus-within:border-accent sm:flex-row sm:items-center sm:gap-0"
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
            >
              <div className="flex min-w-0 flex-1 items-center">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('education.home.search_placeholder')}
                  className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-stretch rounded-full bg-accent px-5 text-sm font-bold text-[#03101e] transition-transform hover:-translate-y-0.5 active:translate-y-px sm:self-auto"
              >
                {t('education.home.browse_catalog')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl py-20 lg:py-28">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">
              {t('education.home.open_resources')}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {t('education.home.open_resources_subtitle')}
            </p>
            <p className="mt-3 text-sm font-semibold text-accent">{t('education.home.mit_partnership')}</p>
          </div>
          <div className="max-w-4xl">
            {externalCourses.map((course) => (
              <ExternalCourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(course.externalUrl)}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 border-t border-white/10 py-20 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 lg:py-28">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">
              {t('education.home.categories')}
            </h2>
          </div>
          <div>
            {categoriesLoading && (
              <div className="space-y-4" aria-label={t('common.loading', { defaultValue: 'Loading' })}>
                {[0, 1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-white/[0.045]" />)}
              </div>
            )}
            {categoriesError && (
              <p className="border-l-2 border-destructive pl-4 text-sm text-muted-foreground">
                {t('education.home.categories_error', { defaultValue: 'Categories could not be loaded.' })}
              </p>
            )}
            {!categoriesLoading && !categoriesError && (
              <div className="grid sm:grid-cols-2">
                {categories?.map((category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => navigate(`/education/courses?category=${category.slug}`)}
                    className="group flex min-h-20 items-center justify-between border-b border-white/10 px-1 py-5 text-start sm:px-5 sm:first:pl-0"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                        {localized(category, 'name')}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </button>
                ))}
                {!categories?.length && (
                  <p className="text-sm text-muted-foreground">
                    {t('education.home.no_categories', { defaultValue: 'New learning paths are being prepared.' })}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-t border-white/10 pt-20 lg:pt-28">
          <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">
              {t('education.home.featured')}
            </h2>
            <button
              type="button"
              onClick={() => navigate('/education/courses')}
              className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-accent"
            >
              {t('education.home.browse_catalog')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>

          {coursesLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => <div key={item} className="aspect-[4/3] animate-pulse rounded-2xl bg-white/[0.045]" />)}
            </div>
          )}
          {coursesError && (
            <p className="border-l-2 border-destructive pl-4 text-sm text-muted-foreground">
              {t('education.home.courses_error', { defaultValue: 'Featured courses could not be loaded.' })}
            </p>
          )}
          {!coursesLoading && !coursesError && featuredCourses && featuredCourses.length > 0 && (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <article
                  key={course.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/education/course/${course.slug}`)}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#101824]">
                    {course.hero_image && (
                      <AnimatedImage
                        src={course.hero_image}
                        alt={localized(course, 'title')}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                        containerClassName="h-full w-full"
                      />
                    )}
                  </div>
                  <div className="pt-5">
                    <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                      <span>{course.categories ? localized(course.categories, 'name') : t(`education.levels.${course.level}`)}</span>
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-accent" />{course.rating.toFixed(1)}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold tracking-[-0.025em] transition-colors group-hover:text-accent">
                      {localized(course, 'title')}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {localized(course, 'subtitle')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
          {!coursesLoading && !coursesError && !featuredCourses?.length && (
            <p className="text-sm text-muted-foreground">
              {t('education.home.no_featured', { defaultValue: 'Featured courses will appear here soon.' })}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};
