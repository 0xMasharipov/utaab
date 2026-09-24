import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import mark from '@/assets/utaab-mark-white.svg';
import embossedMark from '@/assets/utaab-mark-white-3d.svg';

/** Local certificate artwork. Only transforms move; sample content is never verification evidence. */
export default function Certificate3D() {
  const { t } = useTranslation();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.15 });
  const [reduced, setReduced] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(8);
  const y = useMotionValue(-12);
  const rotateX = useSpring(x, { stiffness: 105, damping: 25 });
  const rotateY = useSpring(y, { stiffness: 105, damping: 25 });

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setFinePointer(media.matches); setReduced(motionPreference.matches); };
    update(); media.addEventListener('change', update); motionPreference.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); motionPreference.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    if (reduced || !inView || !finePointer) {
      setHovered(false);
      x.set(8); y.set(-12);
    }
  }, [reduced, inView, finePointer, x, y]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || !finePointer || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
    x.set(8 - py * 8); y.set(-12 + px * 12);
  };
  const onLeave = () => { setHovered(false); x.set(8); y.set(-12); };

  return <figure className="cv-showcase">
    <div ref={stage} className={`cv-stage ${inView && !reduced ? 'cv-stage-active' : ''} ${hovered ? 'cv-stage-hovered' : ''}`}
      onPointerEnter={event => { if (finePointer && !reduced && event.pointerType === 'mouse') setHovered(true); }}
      onPointerMove={onMove} onPointerLeave={onLeave} onPointerCancel={onLeave}>
      <div className="cv-stage-grid" aria-hidden="true" />
      <div className="cv-float">
        <motion.div className="cv-certificate" role="img" aria-label={t('verifyCertificate.studio.previewAlt')}
          style={{ rotateX: reduced ? 8 : rotateX, rotateY: reduced ? -12 : rotateY, transformPerspective: 1200 }}>
          <div className="cv-certificate-back" aria-hidden="true" />
          <div className="cv-certificate-face" aria-hidden="true">
            <div className="cv-certificate-header"><div className="cv-certificate-brand"><img src={mark} alt="" width={120} height={120} />UTAAB</div><span>{t('verifyCertificate.studio.sample')}</span></div>
            <img src={mark} alt="" className="cv-certificate-watermark" width={120} height={120} />
            <div className="cv-certificate-content">
              <p className="cv-certificate-kicker">{t('verifyCertificate.studio.community')}</p>
              <p className="cv-certificate-title">{t('verifyCertificate.studio.certificateTitle')}</p>
              <div className="cv-certificate-recipient"><span>{t('verifyCertificate.studio.presentedTo')}</span><p>{t('verifyCertificate.studio.sampleName')}</p></div>
            </div>
            <div className="cv-certificate-seal"><img src={embossedMark} alt="" width={138} height={144} /></div>
            <div className="cv-certificate-footer"><span>{t('verifyCertificate.studio.certificateFooter')}</span><span>utaab.org</span></div>
            <div className="cv-certificate-band" />
          </div>
        </motion.div>
      </div>
    </div>
    <figcaption><span>{t('verifyCertificate.studio.previewCaption')}</span><span>UTAAB</span></figcaption>
  </figure>;
}
