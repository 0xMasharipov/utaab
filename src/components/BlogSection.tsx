import { useTranslation } from 'react-i18next';
import { motion, MotionConfig, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { NavArrowRight } from 'iconoir-react';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogCard } from '@/components/blog/BlogCard';
import { Link } from 'react-router-dom';
import './blog/home-blog.css';

export const BlogSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reducedMotion = useReducedMotion();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['homepage-blog'],
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false, nullsFirst: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <MotionConfig reducedMotion="user">
    <section id="blog" aria-labelledby="home-blog-title" className="home-blog py-16 md:py-24 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={isInView || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 id="home-blog-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-2">
            {t('blog.sectionTitle', 'Latest from the Blog')}
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12" role="status">
            <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
            <span className="sr-only">{t('blog.loading')}</span>
          </div>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="home-blog-grid">
              {posts.slice(0, 3).map((post, i) => (
                <div key={post.id} className="home-blog-post">
                  <BlogCard post={post} index={i} />
                </div>
              ))}

            </div>
            <div className="home-blog-more">
              <Link to="/blog" className="home-blog-all">
                  {t('blog.viewAll', 'View All Posts')}
                  <NavArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
            <p className="text-muted-foreground">{t('blog.noResults', 'No posts found')}</p>
          </div>
        )}
      </div>
    </section>
    </MotionConfig>
  );
};
