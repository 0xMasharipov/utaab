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
      titleKey: 'events.event1.title',
      dateKey: 'events.event1.date',
      locationKey: 'events.event1.location',
      attendees: 50,
    },
    {
      titleKey: 'events.event2.title',
      dateKey: 'events.event2.date',
      locationKey: 'events.event2.location',
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glow-soft px-2">
            {t('events.title')}
          </h2>
        </motion.div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 px-2">{t('events.upcoming')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 group"
              >
                <h4 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                  {t(event.titleKey)}
                </h4>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    <span>{t(event.dateKey)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span>{t(event.locationKey)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span>{t('events.attendees', { count: event.attendees })}</span>
                  </div>
                </div>
                <Button className="btn-primary w-full mt-6" disabled>{t('common.soon')}</Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 px-2">{t('events.past')}</h3>
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
            <p className="text-muted-foreground">{t('events.noEvents')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
