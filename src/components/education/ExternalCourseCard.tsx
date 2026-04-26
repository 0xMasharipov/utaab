import { ExternalLink, Star, Users, Clock, Info, GraduationCap, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExternalCourse } from "@/data/externalCourses";
import { useTranslation } from "react-i18next";
import AnimatedImage from "@/components/common/AnimatedImage";
import GlassCard from "@/components/glass/GlassCard";

interface ExternalCourseCardProps {
  course: ExternalCourse;
  onClick: () => void;
}

export const ExternalCourseCard = ({ course, onClick }: ExternalCourseCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'en' | 'tr' | 'ru' | 'ar';

  const getLocalizedText = (field: 'title' | 'subtitle' | 'description' | 'category') => {
    if (field === 'category') {
      return course.category[`name_${locale}`] || course.category.name_en;
    }
    return course[`${field}_${locale}`] || course[`${field}_en`];
  };

  const getCourseLevel = (level: string) => {
    const key = `education.levels.${level}`;
    const translated = t(key);
    return translated === key ? level : translated;
  };

  return (
    <GlassCard
      onClick={onClick}
      hover
      className="cursor-pointer overflow-hidden group p-0"
    >
      <div className="relative h-48 overflow-hidden">
        <AnimatedImage
          src={course.hero_image}
          alt={getLocalizedText('title')}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          containerClassName="w-full h-full"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="outline" className="glass border-accent/30 text-accent backdrop-blur-sm gap-1">
            <GraduationCap className="h-3 w-3" />
            MIT OCW
          </Badge>
          {course.is_free && (
            <Badge variant="outline" className="glass border-accent/30 text-accent backdrop-blur-sm">
              {t('education.external_card.free')}
            </Badge>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="glass border-white/20 text-foreground backdrop-blur-sm">
            {getLocalizedText('category')}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {getLocalizedText('title')}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {getLocalizedText('subtitle')}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {getLocalizedText('description')}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold">{course.rating}</span>
            <span className="text-muted-foreground">({course.total_reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{course.total_enrollments.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Signal className="h-4 w-4 text-accent" />
            {getCourseLevel(course.level)}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.duration_hours}h</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
          <Info className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{t('education.external_card.provided_by', { source: course.source })}</span>
        </div>
      </div>
    </GlassCard>
  );
};
