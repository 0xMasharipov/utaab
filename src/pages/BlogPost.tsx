import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { PDFAttachment } from '@/components/blog/PDFAttachment';
import { BlogCard } from '@/components/blog/BlogCard';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import GlassCard from '@/components/glass/GlassCard';
import { PrivacyPopup } from '@/components/PrivacyPopup';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { FloatingPrivacyButton } from '@/components/FloatingPrivacyButton';
import AnimatedImage from '@/components/common/AnimatedImage';

interface ContentBlock {
  type: string;
  content?: string;
  url?: string;
  alt?: string;
  language?: string;
  level?: number;
  items?: string[];
}

const RenderBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'heading':
      const HeadingTag = `h${block.level || 2}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <HeadingTag className="text-foreground font-bold mt-8 mb-4">{block.content}</HeadingTag>;
    case 'paragraph':
      return <p className="text-muted-foreground leading-relaxed mb-4">{block.content}</p>;
    case 'quote':
      return <blockquote className="border-l-4 border-accent pl-4 py-2 my-6 italic text-muted-foreground">{block.content}</blockquote>;
    case 'code':
      return <pre className="bg-white/[0.03] border border-white/10 rounded-xl p-4 my-6 overflow-x-auto text-sm font-mono text-foreground"><code>{block.content}</code></pre>;
    case 'image':
      return (
        <figure className="my-6">
          <AnimatedImage src={block.url} alt={block.alt || ''} className="w-full rounded-xl" loading="lazy" />
          {block.alt && <figcaption className="text-center text-xs text-muted-foreground mt-2">{block.alt}</figcaption>}
        </figure>
      );
    case 'video':
      if (block.url?.includes('youtube') || block.url?.includes('youtu.be')) {
        const vid = block.url.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
        return <div className="aspect-video my-6 rounded-xl overflow-hidden"><iframe src={`https://www.youtube.com/embed/${vid}`} className="w-full h-full" allowFullScreen title="Video" /></div>;
      }
      return <video src={block.url} controls className="w-full rounded-xl my-6" />;
    case 'list':
      return <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">{block.items?.map((item, i) => <li key={i}>{item}</li>)}</ul>;
    default:
      return null;
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'tr' | 'ru' | 'ar';
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      setPost(data);
      if (data) {
        document.title = data.meta_title || data.title_en;
        const meta = document.querySelector('meta[name="description"]');
        if (meta && data.meta_description) meta.setAttribute('content', data.meta_description);

        // Fetch related posts
        if (data.tags?.length) {
          const { data: rel } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .neq('id', data.id)
            .overlaps('tags', data.tags)
            .limit(3);
          setRelated(rel || []);
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AnimatedBlobBackground />
        <Navbar />
        <div className="pt-32 text-center section-container">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Button asChild><Link to="/blog">{t('blog.backToBlog', 'Back to Blog')}</Link></Button>
        </div>
      </div>
    );
  }

  const title = (post as any)[`title_${lang}`] || post.title_en;
  const excerpt = (post as any)[`excerpt_${lang}`] || post.excerpt_en;
  const content: ContentBlock[] = Array.isArray(post.content) ? post.content : [];
  const attachments: any[] = Array.isArray(post.attachments) ? post.attachments : [];
  const pdfAttachments = attachments.filter(a => a.type === 'pdf' || a.url?.endsWith('.pdf'));
  const gallery: string[] = Array.isArray(post.gallery) ? post.gallery.filter((g: any) => typeof g === 'string') : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <article>
        <header className="relative pt-24 pb-12">
          {post.cover_image && (
            <div className="absolute inset-0 z-0">
              <AnimatedImage src={post.cover_image} alt={title} className="w-full h-full object-cover opacity-20" containerClassName="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
            </div>
          )}
          <div className="relative z-10 section-container pt-12">
            <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-foreground">
              <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" /> {t('blog.backToBlog', 'Back to Blog')}</Link>
            </Button>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 max-w-4xl"
            >
              {title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {post.author_name && (
                <div className="flex items-center gap-2"><User className="h-4 w-4" /> {post.author_name}</div>
              )}
              {post.publish_date && (
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {format(new Date(post.publish_date), 'MMMM d, yyyy')}</div>
              )}
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">{tag}</span>
                ))}
              </div>
            )}

            {excerpt && (
              <p className="text-muted-foreground text-lg leading-relaxed mt-6 max-w-4xl">
                {excerpt}
              </p>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="section-container pb-12">
          <div className="max-w-3xl mx-auto prose-custom">
            {content.map((block, i) => <RenderBlock key={i} block={block} />)}
          </div>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="max-w-3xl mx-auto mt-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('blog.gallery', 'Gallery')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group">
                    <AnimatedImage
                      src={url}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      containerClassName="rounded-xl overflow-hidden"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          {post.video_url && post.video_type === 'embed' && (
            <div className="max-w-3xl mx-auto my-8">
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe src={post.video_url} className="w-full h-full" allowFullScreen title="Video" />
              </div>
            </div>
          )}

          {/* PDF Attachments */}
          {pdfAttachments.length > 0 && (
            <div className="max-w-3xl mx-auto mt-8 space-y-3">
              <h3 className="text-lg font-semibold text-foreground mb-3">{t('blog.attachments', 'Attachments')}</h3>
              {pdfAttachments.map((att, i) => (
                <PDFAttachment key={i} name={att.name || 'Document.pdf'} url={att.url} />
              ))}
            </div>
          )}

          {/* Share */}
          <div className="max-w-3xl mx-auto mt-10 pt-6 border-t border-white/10">
            <ShareButtons url={window.location.href} title={title} />
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="pb-16">
            <div className="section-container">
              <h2 className="text-2xl font-bold text-foreground mb-8">{t('blog.relatedPosts', 'Related Posts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((p, i) => <BlogCard key={p.id} post={p} index={i} />)}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer onPrivacyClick={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyPopup onAccept={() => {}} onCustomize={() => setIsPrivacyCenterOpen(true)} />
      <PrivacyCenter isOpen={isPrivacyCenterOpen} onClose={() => setIsPrivacyCenterOpen(false)} />
      <FloatingPrivacyButton onClick={() => setIsPrivacyCenterOpen(true)} />
    </div>
  );
};

export default BlogPost;
