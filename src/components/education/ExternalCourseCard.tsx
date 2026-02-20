import { ExternalLink, Star, Users, Clock, Info } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalCourse } from "@/data/externalCourses";
import { useTranslation } from "react-i18next";
import AnimatedImage from "@/components/common/AnimatedImage";

interface ExternalCourseCardProps {
  course: ExternalCourse;
  onClick: () => void;
}

export const ExternalCourseCard = ({ course, onClick }: ExternalCourseCardProps) => {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'en' | 'tr' | 'ru' | 'ar';

  const getLocalizedText = (field: 'title' | 'subtitle' | 'description' | 'category') => {
    if (field === 'category') {
      return course.category[`name_${locale}`] || course.category.name_en;
    }
    return course[`${field}_${locale}`] || course[`${field}_en`];
  };

  const getCourseLevel = (level: string) => {
    const levels: Record<string, string> = {
      beginner: "🟢 Beginner",
      intermediate: "🟡 Intermediate",
      advanced: "🔴 Advanced",
    };
    return levels[level] || level;
  };

  return (
    <Card
      onClick={onClick}
      className="glass cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:border-accent/40 overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <AnimatedImage
          src={course.hero_image}
          alt={getLocalizedText('title')}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          containerClassName="w-full h-full"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className="bg-blue-500/90 text-white border-blue-400/50 backdrop-blur-sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            MIT OCW
          </Badge>
          {course.is_free && (
            <Badge className="bg-green-500/90 text-white border-green-400/50 backdrop-blur-sm">
              FREE
            </Badge>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="backdrop-blur-sm">
            {course.category.icon} {getLocalizedText('category')}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
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
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold">{course.rating}</span>
            <span className="text-muted-foreground">({course.total_reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{course.total_enrollments.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{getCourseLevel(course.level)}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.duration_hours}h</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
          <Info className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">Provided by {course.source}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
