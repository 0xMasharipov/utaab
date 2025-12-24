import { useState, useEffect, useCallback, useRef } from 'react';

export interface BehaviorData {
  mouseMovements: number;
  mouseEntropy: number;
  keystrokeCount: number;
  avgKeystrokeInterval: number;
  scrollEvents: number;
  timeOnPage: number;
  formFocusTime: number;
  clickCount: number;
}

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Hook to track user behavior for bot detection
 */
export function useUtaabBehavior() {
  const [isTracking, setIsTracking] = useState(false);
  const startTimeRef = useRef<number>(0);
  const formFocusTimeRef = useRef<number>(0);
  
  // Tracking data
  const mousePositionsRef = useRef<MousePosition[]>([]);
  const keystrokeTimestampsRef = useRef<number[]>([]);
  const scrollCountRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

  // Calculate mouse movement entropy (randomness)
  const calculateMouseEntropy = useCallback((): number => {
    const positions = mousePositionsRef.current;
    if (positions.length < 3) return 0;

    // Calculate angles between consecutive movements
    const angles: number[] = [];
    for (let i = 2; i < positions.length; i++) {
      const dx1 = positions[i - 1].x - positions[i - 2].x;
      const dy1 = positions[i - 1].y - positions[i - 2].y;
      const dx2 = positions[i].x - positions[i - 1].x;
      const dy2 = positions[i].y - positions[i - 1].y;

      const angle1 = Math.atan2(dy1, dx1);
      const angle2 = Math.atan2(dy2, dx2);
      const angleDiff = Math.abs(angle2 - angle1);
      angles.push(angleDiff);
    }

    if (angles.length === 0) return 0;

    // Calculate variance of angle changes (higher = more random = more human)
    const mean = angles.reduce((a, b) => a + b, 0) / angles.length;
    const variance = angles.reduce((sum, angle) => sum + Math.pow(angle - mean, 2), 0) / angles.length;
    
    // Normalize to 0-1 range
    return Math.min(1, variance / Math.PI);
  }, []);

  // Calculate average keystroke interval
  const calculateAvgKeystrokeInterval = useCallback((): number => {
    const timestamps = keystrokeTimestampsRef.current;
    if (timestamps.length < 2) return 0;

    const intervals: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }

    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }, []);

  // Event handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionsRef.current.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    });
    
    // Keep only last 100 positions
    if (mousePositionsRef.current.length > 100) {
      mousePositionsRef.current = mousePositionsRef.current.slice(-100);
    }
  }, []);

  const handleKeyDown = useCallback(() => {
    keystrokeTimestampsRef.current.push(Date.now());
    
    // Keep only last 50 timestamps
    if (keystrokeTimestampsRef.current.length > 50) {
      keystrokeTimestampsRef.current = keystrokeTimestampsRef.current.slice(-50);
    }
  }, []);

  const handleScroll = useCallback(() => {
    scrollCountRef.current++;
  }, []);

  const handleClick = useCallback(() => {
    clickCountRef.current++;
  }, []);

  const handleFocus = useCallback((e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      if (formFocusTimeRef.current === 0) {
        formFocusTimeRef.current = Date.now() - startTimeRef.current;
      }
    }
  }, []);

  // Start tracking
  const startTracking = useCallback(() => {
    if (isTracking) return;

    startTimeRef.current = Date.now();
    formFocusTimeRef.current = 0;
    mousePositionsRef.current = [];
    keystrokeTimestampsRef.current = [];
    scrollCountRef.current = 0;
    clickCountRef.current = 0;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('focusin', handleFocus, { passive: true });

    setIsTracking(true);
  }, [isTracking, handleMouseMove, handleKeyDown, handleScroll, handleClick, handleFocus]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (!isTracking) return;

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClick);
    document.removeEventListener('focusin', handleFocus);

    setIsTracking(false);
  }, [isTracking, handleMouseMove, handleKeyDown, handleScroll, handleClick, handleFocus]);

  // Get current behavior data
  const getBehaviorData = useCallback((): BehaviorData => {
    return {
      mouseMovements: mousePositionsRef.current.length,
      mouseEntropy: calculateMouseEntropy(),
      keystrokeCount: keystrokeTimestampsRef.current.length,
      avgKeystrokeInterval: calculateAvgKeystrokeInterval(),
      scrollEvents: scrollCountRef.current,
      timeOnPage: Date.now() - startTimeRef.current,
      formFocusTime: formFocusTimeRef.current,
      clickCount: clickCountRef.current
    };
  }, [calculateMouseEntropy, calculateAvgKeystrokeInterval]);

  // Reset tracking data
  const resetTracking = useCallback(() => {
    startTimeRef.current = Date.now();
    formFocusTimeRef.current = 0;
    mousePositionsRef.current = [];
    keystrokeTimestampsRef.current = [];
    scrollCountRef.current = 0;
    clickCountRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('scroll', handleScroll);
        document.removeEventListener('click', handleClick);
        document.removeEventListener('focusin', handleFocus);
      }
    };
  }, [isTracking, handleMouseMove, handleKeyDown, handleScroll, handleClick, handleFocus]);

  return {
    isTracking,
    startTracking,
    stopTracking,
    getBehaviorData,
    resetTracking
  };
}
