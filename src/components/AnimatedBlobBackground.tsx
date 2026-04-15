const AnimatedBlobBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ contain: 'strict' }}>
      {/* Blob 1 - Large blue */}
      <div
        className="absolute w-[600px] h-[600px] opacity-45 animate-blob-1"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 35%) 0%, transparent 70%)',
          filter: 'blur(90px)',
          top: '10%',
          left: '15%',
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      />
      {/* Blob 2 - Purple accent */}
      <div
        className="absolute w-[500px] h-[500px] opacity-40 animate-blob-2"
        style={{
          background: 'radial-gradient(circle, hsl(260 60% 50%) 0%, transparent 70%)',
          filter: 'blur(85px)',
          top: '50%',
          right: '10%',
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      />
      {/* Blob 3 - Bright blue */}
      <div
        className="absolute w-[550px] h-[550px] opacity-[0.38] animate-blob-3"
        style={{
          background: 'radial-gradient(circle, hsl(213 94% 68%) 0%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '10%',
          left: '40%',
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      />
      {/* Blob 4 - Deep blue */}
      <div
        className="absolute w-[400px] h-[400px] opacity-35 animate-blob-4"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 25%) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '30%',
          left: '60%',
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      />
      {/* Blob 5 - Cyan accent */}
      <div
        className="absolute w-[350px] h-[350px] opacity-30 animate-blob-2"
        style={{
          background: 'radial-gradient(circle, hsl(190 90% 50%) 0%, transparent 70%)',
          filter: 'blur(90px)',
          top: '70%',
          left: '15%',
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      />
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-grain" />
    </div>
  );
};

export default AnimatedBlobBackground;
