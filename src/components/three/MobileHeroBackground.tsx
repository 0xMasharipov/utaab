const MobileHeroBackground = () => {
  return (
    <div className="absolute inset-0 bg-background overflow-hidden">
      {/* Animated blob layer */}
      <div className="absolute inset-0">
        {/* Blob 1 - Primary blue, top-left drift */}
        <div className="hero-blob hero-blob-1" />
        {/* Blob 2 - Accent blue, bottom-right drift */}
        <div className="hero-blob hero-blob-2" />
        {/* Blob 3 - Deep navy, center float */}
        <div className="hero-blob hero-blob-3" />
        {/* Blob 4 - Subtle white glow */}
        <div className="hero-blob hero-blob-4" />
      </div>
      {/* Subtle dot grid overlay */}
      <div className="absolute inset-0 mobile-hero-grid" />
    </div>
  );
};

export default MobileHeroBackground;
