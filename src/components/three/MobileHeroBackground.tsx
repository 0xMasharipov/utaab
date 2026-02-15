const MobileHeroBackground = () => {
  return (
    <div className="absolute inset-0 bg-background overflow-hidden">
      {/* Animated gradient layer */}
      <div className="absolute inset-0 mobile-hero-gradient" />
      {/* Dot grid overlay */}
      <div className="absolute inset-0 mobile-hero-grid" />
    </div>
  );
};

export default MobileHeroBackground;
