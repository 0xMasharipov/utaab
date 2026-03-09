import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogCard } from '@/components/blog/BlogCard';
import { Link } from 'react-router-dom';

export const BlogSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['homepage-blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false, nullsFirst: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="blog" className="py-20 md:py-32 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glow-soft px-2">
            {t('blog.sectionTitle', 'Latest from the Blog')}
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center mt-10"
            >
              <Link to="/blog">
                <Button variant="outline" className="rounded-full gap-2 border-white/20 hover:bg-white/[0.08]">
                  {t('blog.viewAll', 'View All Posts')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
            <p className="text-muted-foreground">{t('blog.noResults', 'No posts found')}</p>
          </div>
        )}
      </div>
    </section>
  );
};
