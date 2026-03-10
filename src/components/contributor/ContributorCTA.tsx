import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface ContributorCTAProps {
  onStartAssessment: () => void;
}

const ContributorCTA = ({ onStartAssessment }: ContributorCTAProps) => {
  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Your journey in UTAAB starts with the{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">right role.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Take the assessment and discover where you can create the most value.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStartAssessment}
            size="lg"
            className="bg-primary/80 backdrop-blur-xl hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300"
          >
            Take the Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/[0.06] backdrop-blur-xl border-white/[0.12] hover:bg-white/[0.10] text-foreground px-8 py-6 text-lg rounded-xl transition-all duration-300"
            asChild
          >
            <a href="https://wa.me/message/UTAAB" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact UTAAB
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default ContributorCTA;
