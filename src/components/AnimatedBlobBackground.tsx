import { useState, useEffect } from 'react';

const blobStyle = (extra: React.CSSProperties): React.CSSProperties => ({
  willChange: 'transform',
  contain: 'layout style paint',
  borderRadius: '50%',
  opacity: 0,
  ...extra,
});

const AnimatedBlobBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const schedule = typeof requestIdleCallback === 'function'
      ? (cb: () => void) => requestIdleCallback(cb, { timeout: 2000 })
      : (cb: () => void) => setTimeout(cb, 1500);
    const id = schedule(() => { if (!cancelled) setMounted(true); });
    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback === 'function' && typeof id === 'number') {
        cancelIdleCallback(id);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ contain: 'strict' }}
    >
      {mounted && (
        <>
          <div
            className="absolute w-[600px] h-[600px] animate-blob-1"
            style={blobStyle({
              background: 'radial-gradient(circle, hsl(217 91% 35%) 0%, transparent 70%)',
              filter: 'blur(90px)',
              top: '10%',
              left: '15%',
              animation: 'blob-fade-in 0.6s ease-out 0.1s forwards, blob-1 20s ease-in-out infinite',
            })}
          />
          <div
            className="absolute w-[500px] h-[500px] animate-blob-2"
            style={blobStyle({
              background: 'radial-gradient(circle, hsl(260 60% 50%) 0%, transparent 70%)',
              filter: 'blur(85px)',
              top: '50%',
              right: '10%',
              animation: 'blob-fade-in 0.6s ease-out 0.15s forwards, blob-2 25s ease-in-out infinite',
            })}
          />
          <div
            className="absolute w-[550px] h-[550px] animate-blob-3"
            style={blobStyle({
              background: 'radial-gradient(circle, hsl(213 94% 68%) 0%, transparent 70%)',
              filter: 'blur(80px)',
              bottom: '10%',
              left: '40%',
              animation: 'blob-fade-in 0.6s ease-out 0.2s forwards, blob-3 22s ease-in-out infinite',
            })}
          />
          <div
            className="absolute w-[400px] h-[400px] animate-blob-4"
            style={blobStyle({
              background: 'radial-gradient(circle, hsl(217 91% 25%) 0%, transparent 70%)',
              filter: 'blur(80px)',
              top: '30%',
              left: '60%',
              animation: 'blob-fade-in 0.6s ease-out 0.25s forwards, blob-4 18s ease-in-out infinite',
            })}
          />
          <div
            className="absolute w-[350px] h-[350px] animate-blob-2"
            style={blobStyle({
              background: 'radial-gradient(circle, hsl(190 90% 50%) 0%, transparent 70%)',
              filter: 'blur(90px)',
              top: '70%',
              left: '15%',
              animation: 'blob-fade-in 0.6s ease-out 0.3s forwards, blob-2 25s ease-in-out infinite',
            })}
          />
        </>
      )}
      <div className="absolute inset-0 opacity-[0.03] bg-grain" />
    </div>
  );
};

export default AnimatedBlobBackground;
