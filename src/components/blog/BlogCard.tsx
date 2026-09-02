import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';

interface BlogCardProps {
  post: {
    slug: string;
    title_en: string;
    title_tr?: string | null;
    title_ru?: string | null;
    title_ar?: string | null;
    excerpt_en?: string | null;
    excerpt_tr?: string | null;
    excerpt_ru?: string | null;
    excerpt_ar?: string | null;
    cover_image?: string | null;
    publish_date?: string | null;
    tags?: string[];
    gallery?: any | null;
  };
  index?: number;
  /** Eager-load the cover image (use for the first visible row). */
  priority?: boolean;
}

export const BlogCard = ({ post, index = 0, priority = false }: BlogCardProps) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language as 'en' | 'tr' | 'ru' | 'ar';

  const title = (post as any)[`title_${lang}`] || post.title_en;
  const excerpt = (post as any)[`excerpt_${lang}`] || post.excerpt_en;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/blog/${post.slug}`}>
        <GlassCard hover glow className="overflow-hidden group h-full">
          {post.cover_image && (
            <div className="relative h-48 overflow-hidden">
              <AnimatedImage
                src={post.cover_image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                containerClassName="w-full h-full"
                loading={priority ? 'eager' : 'lazy'}
                {...(priority ? { fetchpriority: 'high' } : {})}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}

          <div className="p-5">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 text-xs text-accent/90">
                {post.tags.slice(0, 3).map((tag, i) => (
                  <span key={tag}>
                    {i > 0 && <span className="text-accent/40 mr-2">•</span>}
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {post.gallery && post.gallery.length > 0 && (
              <div className="flex gap-2 mb-3">
                {post.gallery.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden border border-border/30">
                    <AnimatedImage
                      src={typeof img === 'string' ? img : ''}
                      alt={`Gallery ${idx + 1}`}
                      className="h-full w-full object-cover"
                      containerClassName="h-full w-full"
                      loading="lazy"
                    />
                  </div>
                ))}
                {post.gallery.length > 4 && (
                  <div className="h-10 w-10 flex-shrink-0 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                    +{post.gallery.length - 4}
                  </div>
                )}
              </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{excerpt}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{post.publish_date ? format(new Date(post.publish_date), 'MMM d, yyyy') : ''}</span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};
