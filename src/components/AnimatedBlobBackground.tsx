const AnimatedBlobBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blob 1 - Large blue */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 animate-blob-1"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 35%) 0%, transparent 70%)',
          filter: 'blur(100px)',
          top: '10%',
          left: '15%',
        }}
      />
      {/* Blob 2 - Purple accent */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-25 animate-blob-2"
        style={{
          background: 'radial-gradient(circle, hsl(260 60% 50%) 0%, transparent 70%)',
          filter: 'blur(110px)',
          top: '50%',
          right: '10%',
        }}
      />
      {/* Blob 3 - Bright blue */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full opacity-20 animate-blob-3"
        style={{
          background: 'radial-gradient(circle, hsl(213 94% 68%) 0%, transparent 70%)',
          filter: 'blur(90px)',
          bottom: '10%',
          left: '40%',
        }}
      />
      {/* Blob 4 - Deep blue small */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-20 animate-blob-4"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 25%) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '30%',
          left: '60%',
        }}
      />
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-grain" />
    </div>
  );
};

export default AnimatedBlobBackground;
