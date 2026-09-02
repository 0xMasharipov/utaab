import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Group, Globe, OpenNewWindow } from 'iconoir-react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import AnimatedImage from '@/components/common/AnimatedImage';

export const Events = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: events, isLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('visibility', 'published')
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const now = new Date();
  const upcomingEvents = events?.filter(e => new Date(e.start_date) >= now) || [];
  const pastEvents = events?.filter(e => new Date(e.start_date) < now) || [];

  const getLocalizedTitle = (event: any) => {
    const lang = i18n.language as 'en' | 'tr' | 'ar' | 'ru';
    return event[`title_${lang}`] || event.title_en;
  };

  const getLocalizedDescription = (event: any) => {
    const lang = i18n.language as 'en' | 'tr' | 'ar' | 'ru';
    return event[`description_${lang}`] || event.description_en;
  };

  const renderLocationInfo = (event: any) => {
    const locationType = event.location_type;
    
    return (
      <div className="space-y-2">
        {(locationType === 'physical' || locationType === 'hybrid') && event.location_address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent flex-shrink-0" strokeWidth={1.5} />
            <span className="text-muted-foreground">{event.location_address}</span>
          </div>
        )}
        {(locationType === 'online' || locationType === 'hybrid') && (
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent flex-shrink-0" strokeWidth={1.5} />
            <span className="text-muted-foreground">{t('events.onlineEvent')}</span>
            {event.location_online_link && (
              <a 
                href={event.location_online_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline inline-flex items-center gap-1"
              >
                <OpenNewWindow className="h-4 w-4" strokeWidth={1.5} />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderEventCard = (event: any, index: number) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 group"
    >
      {event.cover_image && (
        <AnimatedImage 
          src={event.cover_image} 
          alt={getLocalizedTitle(event)}
          className="w-full h-40 object-cover rounded-xl mb-4 shadow-[0_8px_24px_rgba(59,130,246,0.15)] group-hover:shadow-[0_12px_32px_rgba(59,130,246,0.28)] transition-shadow duration-500"
          placeholderClassName="rounded-xl"
        />
      )}
      <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
        {getLocalizedTitle(event)}
      </h4>
      {getLocalizedDescription(event) && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {getLocalizedDescription(event)}
        </p>
      )}
      <div className="space-y-3 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" strokeWidth={1.5} />
          <span>
            {format(new Date(event.start_date), 'PPP')}
            {event.end_date && ` - ${format(new Date(event.end_date), 'PPP')}`}
          </span>
        </div>
        {renderLocationInfo(event)}
        {event.capacity && (
          <div className="flex items-center gap-2">
             <Group className="h-5 w-5 text-accent" strokeWidth={1.5} />
             <span>{t('events.capacity', { count: event.capacity })}</span>
          </div>
        )}
      </div>
      {event.rsvp_link && (
        <Button 
          className="btn-primary w-full mt-6" 
          onClick={() => window.open(event.rsvp_link, '_blank')}
        >
          {t('events.rsvp')}
        </Button>
      )}
    </motion.div>
  );

  return (
    <section id="events" className="py-16 md:py-24 relative" ref={ref}>
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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <div className="mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 px-2">
                {t('events.upcoming')}
              </h3>
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.map((event, index) => renderEventCard(event, index))}
                </div>
              ) : (
                <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
                  <p className="text-muted-foreground">{t('events.noUpcoming')}</p>
                </div>
              )}
            </div>

            {/* Past Events */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 px-2">
                {t('events.past')}
              </h3>
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastEvents.map((event, index) => renderEventCard(event, index))}
                </div>
              ) : (
                <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
                  <p className="text-muted-foreground">{t('events.noEvents')}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
