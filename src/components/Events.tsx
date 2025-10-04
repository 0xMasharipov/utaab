import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Events = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Example events - in real app, these would come from a database
  const upcomingEvents = [
    {
      title: 'Blockchain Fundamentals Workshop',
      date: 'December 15, 2025',
      location: 'Main Campus',
      attendees: 50,
    },
    {
      title: 'Smart Contract Development',
      date: 'December 22, 2025',
      location: 'Online',
      attendees: 100,
    },
  ];

  return (
    <section id="events" className="py-20 md:py-32 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow-soft">
            {t('events.title')}
          </h2>
        </motion.div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">{t('events.upcoming')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="glass rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group"
              >
                <h4 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                  {event.title}
                </h4>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
                <Button className="btn-primary w-full mt-6">Register</Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">{t('events.past')}</h3>
          <div className="glass rounded-3xl p-8 text-center">
            <p className="text-muted-foreground">{t('events.noEvents')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
