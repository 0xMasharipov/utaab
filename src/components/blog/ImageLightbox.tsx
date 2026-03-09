import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface LightboxImage {
  url: string;
  alt?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex, open, onClose }: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Preload adjacent images
  useEffect(() => {
    if (!open || images.length <= 1) return;
    const preload = (i: number) => { const img = new Image(); img.src = images[i]?.url; };
    preload((currentIndex + 1) % images.length);
    preload((currentIndex - 1 + images.length) % images.length);
  }, [open, currentIndex, images]);

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose, goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goPrev();
    }
  };

  if (!images.length) return null;

  const current = images[currentIndex];

  const glassBtn = 'flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-label="Image viewer"
          aria-modal="true"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Close */}
          <button
            ref={closeRef}
            className={`absolute top-4 right-4 z-10 ${glassBtn}`}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className={`absolute left-3 sm:left-5 z-10 ${glassBtn}`}
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              className={`absolute right-3 sm:right-5 z-10 ${glassBtn}`}
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={current?.url}
              alt={current?.alt || ''}
              className="relative z-[1] max-w-[90vw] max-h-[85vh] object-contain rounded-[24px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-white/50 text-sm font-medium tracking-wide bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
