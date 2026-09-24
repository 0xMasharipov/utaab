import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
  const { t } = useTranslation();
  return <ol className="cm-process-list">
    {[1, 2, 3].map(n => <li key={n}>
      <span aria-hidden="true">0{n}</span>
      <div><h3>{t(`contributor.studio.process${n}Title`)}</h3><p>{t(`contributor.studio.process${n}Text`)}</p></div>
    </li>)}
  </ol>;
}
