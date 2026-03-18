import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Video, Clock, ArrowRight, Blocks, Wallet, Globe, FileCode, Users, TrendingUp, Play } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedBlobBackground } from '@/components/AnimatedBlobBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { guides, videoTutorials } from '@/data/learnGuides';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Blocks, Wallet, Globe, FileCode, Users, TrendingUp,
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  intermediate: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  advanced: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

export const LearnGuides = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'videos' ? 'videos' : 'guides';

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <AnimatedBlobBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-glow-soft">
              {t('learn.title')}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('learnPage.heroSubtitle')}
            </p>
            <p className="text-xs uppercase tracking-[3px] text-white/30 mt-6 font-semibold">
              CONNECT · LEARN · BUILD
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="relative pb-24">
        <div className="section-container">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="mb-8 bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl rounded-2xl p-1.5">
              <TabsTrigger
                value="guides"
                className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white/[0.12] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2"
              >
                <BookOpen className="h-4 w-4" />
                {t('learn.guides')}
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white/[0.12] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2"
              >
                <Video className="h-4 w-4" />
                {t('learn.tutorials')}
              </TabsTrigger>
            </TabsList>

            {/* Guides Tab */}
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide, index) => {
                  const IconComponent = iconMap[guide.icon] || BookOpen;
                  return (
                    <motion.div
                      key={guide.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="glass-section rounded-2xl p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300 group cursor-pointer border border-white/[0.08] hover:border-white/[0.16]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <Badge className={`text-[10px] uppercase tracking-wider border ${difficultyColors[guide.difficulty]}`}>
                          {t(`learnPage.difficulty.${guide.difficulty}`)}
                        </Badge>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                        {t(guide.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {t(guide.descriptionKey)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-white/40">
                          <Clock className="h-3.5 w-3.5" />
                          {guide.estimatedMinutes} {t('learnPage.minutes')}
                        </span>
                        <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10 gap-1 text-xs">
                          {t('learnPage.startLearning')}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoTutorials.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="glass-section rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group cursor-pointer border border-white/[0.08] hover:border-white/[0.16]"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="relative aspect-video bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <span className="absolute bottom-3 right-3 text-xs bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-sm">
                        {video.durationMinutes}:00
                      </span>
                    </div>
                    <div className="p-5">
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider mb-3 bg-white/[0.06] text-white/60 border-white/10">
                        {t(`learnPage.categories.${video.category}`)}
                      </Badge>
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                        {t(video.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {t(video.descriptionKey)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnGuides;
