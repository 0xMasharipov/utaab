const BottomGradientOverlay = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none z-40 h-[140px] md:h-[160px] lg:h-[180px]">
      {/* Main gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(2,5,10,0.85) 0%, rgba(10,31,58,0.50) 40%, rgba(13,40,71,0.20) 70%, transparent 100%)',
        }}
      />
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-[8px]" style={{ mask: 'linear-gradient(to top, black 0%, transparent 70%)', WebkitMask: 'linear-gradient(to top, black 0%, transparent 70%)' }} />
      {/* Grain texture */}
      <div className="absolute inset-0 bg-grain opacity-[0.03]" />
    </div>
  );
};

export default BottomGradientOverlay;
