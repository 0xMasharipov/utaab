import { useEffect, useRef } from 'react';

/** Low-resolution character animation for browsers without usable WebGL2. */
export default function FooterASCIIFallback({ colors }: { colors: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !colors.length) return;
    let visible = false;
    let raf = 0;
    let last = 0;
    let time = 0;
    let paintClock = 0;
    let width = 1;
    let height = 1;
    const characters = '=+xX01#@';

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.font = '12px ui-monospace, Menlo, monospace';
      context.textBaseline = 'middle';
      for (let y = 7; y < height; y += 18) {
        for (let x = 3; x < width; x += 12) {
          const row = y / height;
          const wave = 0.5 + 0.5 * Math.sin(x / width * 5 + row * 7 - time * 0.45);
          const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
          if (hash > 0.65) continue;
          const light = wave * (0.35 + 0.65 * hash);
          context.globalAlpha = 0.15 + light * 0.45;
          context.fillStyle = colors[Math.min(colors.length - 1, Math.floor(light * colors.length))];
          const index = Math.floor(hash * 100 + time * 1.5 + wave * 3) % characters.length;
          context.fillText(characters[index], x, y);
        }
      }
      context.globalAlpha = 1;
      canvas.dataset.frame = String(Number(canvas.dataset.frame || 0) + 1);
    };
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.05;
      last = now;
      time += dt;
      paintClock += dt;
      if (paintClock >= 0.05) {
        paintClock = 0;
        draw();
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      last = 0;
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const resize = new ResizeObserver(() => {
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = width;
      canvas.height = height;
      if (visible && !document.hidden) draw();
      wake();
    });
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    });
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else wake();
    };
    resize.observe(canvas);
    intersection.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [colors]);

  return <canvas ref={ref} data-renderer="ascii-fallback" aria-hidden="true" className="absolute inset-0 block h-full w-full" />;
}