import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import AnimatedBlobBackground from '@/components/AnimatedBlobBackground';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const Workshops = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AnimatedBlobBackground />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass-strong rounded-3xl p-10 sm:p-14 md:p-20 max-w-2xl w-full text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-accent mb-8"
          >
            <Rocket className="h-8 w-8" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Workshops & Bootcamps
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Hands-on educational experiences for builders are coming soon.
          </p>

          <div className="inline-block px-6 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-accent font-bold text-lg tracking-wide">Coming Soon</span>
          </div>

          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            We are preparing practical workshops, guided sessions, and future bootcamps for the UTAAB community.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Follow UTAAB for future announcements.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Workshops;
