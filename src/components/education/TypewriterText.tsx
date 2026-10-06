import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText = ({ text, speed = 30, onComplete }: TypewriterTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [text]);

  const settledText = text.slice(0, Math.max(0, currentIndex - 1));
  const enteringCharacter = currentIndex > 0 ? text[currentIndex - 1] : '';

  return (
    <span className="cutii-reply-reveal whitespace-pre-wrap">
      {settledText}
      {enteringCharacter && (
        <span key={currentIndex} className="cutii-reply-reveal__character">
          {enteringCharacter}
        </span>
      )}
      {currentIndex < text.length && (
        <span className="cutii-reply-reveal__cursor" aria-hidden="true" />
      )}
    </span>
  );
};
