import { motion } from 'framer-motion';

export const Hero = () => {
  const scrollToJoin = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };

  const pills = ['Academic Infrastructure', 'Blockchain', 'Research Innovation'];

  return (
    <section
      id="hero"
      className="relative min-h-[70vh] md:min-h-screen overflow-hidden"
      style={{ background: '#fff' }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/hero-cube.mp4" type="video/mp4" />
      </video>

      {/* White gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.45) 65%, rgba(255,255,255,0) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 items-center"
        style={{ maxWidth: 1400, paddingTop: 120, paddingBottom: 120 }}
      >
        {/* Left column — text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Pill tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start"
          >
            {pills.map((label) => (
              <span
                key={label}
                className="rounded-full font-medium"
                style={{
                  background: 'rgba(11,60,109,0.08)',
                  color: '#0B3C6D',
                  fontSize: 14,
                  padding: '6px 12px',
                }}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-montserrat leading-tight mb-4"
            style={{
              fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.1,
              color: '#1A1A1A',
            }}
          >
            Academic Blockchain Infrastructure{' '}
            for the{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #4A90E2, #6C63FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Next Generation
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-montserrat mb-8"
            style={{
              fontWeight: 400,
              fontSize: 18,
              color: '#6F6F6F',
              maxWidth: 520,
            }}
          >
            UTAAB builds academic blockchain infrastructure connecting universities,
            researchers and innovators through decentralized technologies.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={scrollToJoin}
              className="rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(90deg, #4A90E2, #6C63FF)',
                padding: '16px 28px',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(74,144,226,0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 30px rgba(74,144,226,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(74,144,226,0.3)';
              }}
            >
              Join Us
            </button>

            <button
              className="rounded-full font-semibold transition-all duration-300"
              style={{
                border: '2px solid #0B3C6D',
                color: '#0B3C6D',
                padding: '16px 28px',
                fontWeight: 600,
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = '#0B3C6D';
                btn.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'transparent';
                btn.style.color = '#0B3C6D';
              }}
            >
              Explore Ecosystem
            </button>
          </motion.div>
        </div>

        {/* Right column — spacer (video shows through) */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};
