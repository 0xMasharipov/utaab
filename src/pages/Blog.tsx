import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Calendar } from 'iconoir-react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { BlogCard } from '@/components/blog/BlogCard';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/glass/GlassCard';
import AnimatedImage from '@/components/common/AnimatedImage';
import { format } from 'date-fns';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';

const POSTS_PER_PAGE = 12;

const Blog = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'tr' | 'ru' | 'ar';
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ['blog-posts'],
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const allTags = [...new Set(posts.flatMap(p => p.tags || []))];

  const filtered = posts.filter(p => {
    const title = ((p as any)[`title_${lang}`] || p.title_en || '').toLowerCase();
    const matchSearch = !search || title.includes(search.toLowerCase());
    const matchTag = !selectedTag || (p.tags || []).includes(selectedTag);
    return matchSearch && matchTag;
  });

  const featured = posts.find(p => p.featured);
  const regularPosts = filtered.filter(p => !p.featured || !featured || p.id !== featured.id);
  const paged = regularPosts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);
  const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE);

  const featuredTitle = featured ? ((featured as any)[`title_${lang}`] || featured.title_en) : '';
  const featuredExcerpt = featured ? ((featured as any)[`excerpt_${lang}`] || featured.excerpt_en) : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 sm:pb-16">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4"
          >
            {t('blog.title', 'UTAAB Blog')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t('blog.subtitle', 'Insights, Updates & Web3 Innovations')}
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="pb-12">
          <div className="section-container">
            <Link to={`/blog/${featured.slug}`}>
              <GlassCard hover glow className="overflow-hidden group">
                <div className="grid md:grid-cols-2 gap-0">
                  {featured.cover_image && (
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <AnimatedImage src={featured.cover_image} alt={featuredTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" containerClassName="w-full h-full" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60 hidden md:block" />
                    </div>
                  )}
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <span className="text-xs uppercase tracking-wider text-accent font-semibold mb-3">{t('blog.featured', 'Featured')}</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">{featuredTitle}</h2>
                    {featuredExcerpt && <p className="text-muted-foreground mb-4 line-clamp-3">{featuredExcerpt}</p>}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" strokeWidth={1.5} />
                      <span>{featured.publish_date ? format(new Date(featured.publish_date), 'MMMM d, yyyy') : ''}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="pb-8">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <Input
                placeholder={t('blog.search', 'Search posts...')}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                className="pl-10 glass border-white/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedTag ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setSelectedTag(null); setPage(0); }}
                className="rounded-full"
              >
                {t('blog.all', 'All')}
              </Button>
              {allTags.slice(0, 8).map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setSelectedTag(tag); setPage(0); }}
                  className="rounded-full"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-16">
        <div className="section-container">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">{t('blog.loading', 'Loading...')}</div>
          ) : paged.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">{t('blog.noResults', 'No posts found')}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={page === i ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(i)}
                      className="rounded-full w-10 h-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyPopup onAccept={() => {}} onCustomize={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default Blog;
