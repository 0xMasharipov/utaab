import { useState, useEffect } from 'react';
import { Snowfall } from './Snowfall';

export const HolidayEffects = () => {
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (!isTabVisible) return null;

  return <Snowfall />;
};
