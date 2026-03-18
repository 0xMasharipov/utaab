const ITEMS = 'CONNECT.\u00A0\u00A0LEARN.\u00A0\u00A0BUILD.\u00A0\u00A0\u00A0\u00A0';
const REPEATED = Array(4).fill(ITEMS).join('');

export const HeroCarousel = () => (
  <div
    className="relative z-[5] overflow-hidden select-none"
    style={{
      marginTop: -60,
      marginBottom: 0,
      padding: '28px 0',
      background: 'linear-gradient(to bottom, rgba(10,40,120,0.4), rgba(5,10,25,0.95))',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}
  >
    <div className="hero-carousel-track group">
      <span className="hero-carousel-item">{REPEATED}</span>
      <span className="hero-carousel-item" aria-hidden="true">{REPEATED}</span>
    </div>
  </div>
);
