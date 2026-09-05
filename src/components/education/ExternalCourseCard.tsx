import { ArrowUpRight, Clock, Star, User } from 'iconoir-react';
import { useTranslation } from 'react-i18next';
import { ExternalCourse } from '@/data/externalCourses';
import AnimatedImage from '@/components/common/AnimatedImage';

interface ExternalCourseCardProps {
  course: ExternalCourse;
  onClick: () => void;
}

export const ExternalCourseCard = ({ course, onClick }: ExternalCourseCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.split('-')[0] as 'en' | 'tr' | 'ru' | 'ar';

  const localized = (field: 'title' | 'subtitle' | 'description' | 'category') => {
    if (field === 'category') return course.category[`name_${locale}`] || course.category.name_en;
    return course[`${field}_${locale}`] || course[`${field}_en`];
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      className="group grid cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0c121d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="relative min-h-64 overflow-hidden">
        <AnimatedImage
          src={course.hero_image}
          alt={localized('title')}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          containerClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d16]/75 via-transparent to-transparent md:bg-gradient-to-r" />
        <span className="absolute bottom-4 left-4 text-xs font-semibold text-white">{localized('category')}</span>
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-accent">MIT OpenCourseWare</span>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
        <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{localized('title')}</h3>
        <p className="mt-2 text-sm font-medium text-foreground/75">{localized('subtitle')}</p>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{localized('description')}</p>

        <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:grid-cols-4">
          <span className="flex items-center gap-2"><Star className="h-4 w-4 text-accent" />{course.rating}</span>
          <span className="flex items-center gap-2"><User className="h-4 w-4" />{course.total_enrollments.toLocaleString()}</span>
          <span>{t(`education.levels.${course.level}`)}</span>
          <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{course.duration_hours}h</span>
        </div>
      </div>
    </article>
  );
};
