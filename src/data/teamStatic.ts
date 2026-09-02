import zinurbekImg from '@/assets/team/zinurbek.png';
import umutImg from '@/assets/team/umut.png';
import abdullaImg from '@/assets/team/abdulla.png';
import yunusImg from '@/assets/team/yunus.png';
import abdulbakiImg from '@/assets/team/abdulbaki.png';
import yanaImg from '@/assets/team/yana.png';
import shuaybImg from '@/assets/team/shuayb.png';
import ibrahimImg from '@/assets/team/ibrahim.png';
import burakImg from '@/assets/team/burak.png';
import anarImg from '@/assets/team/anar.png';
import mehmetBarukImg from '@/assets/team/mehmet-baruk.png';

export interface StaticTeamMember {
  key: string;
  image?: string;
  tag: string;
  linkedin?: string;
}

/** Hardcoded roster — used as fallback and as the photo source for DB rows without an image. */
export const STATIC_TEAM: StaticTeamMember[] = [
  { key: 'mehmetBaruk', image: mehmetBarukImg, tag: 'Advisory', linkedin: 'https://linkedin.com/in/mehmet-baruk' },
  { key: 'zinurbek', image: zinurbekImg, tag: 'Founder', linkedin: 'https://linkedin.com/in/masharipov' },
  { key: 'yunus', image: yunusImg, tag: 'Leadership', linkedin: 'https://linkedin.com/in/yunus-emre-e-80921034b' },
  { key: 'abdulla', image: abdullaImg, tag: 'Engineering', linkedin: 'https://linkedin.com/in/abdulla-hamzali-59b5a5229' },
  { key: 'abdulbaki', image: abdulbakiImg, tag: 'Operations' },
  { key: 'umut', image: umutImg, tag: 'Operations' },
  { key: 'anar', image: anarImg, tag: 'Operations', linkedin: 'https://linkedin.com/in/anar-malikov-0430203b6' },
  { key: 'burak', image: burakImg, tag: 'Operations', linkedin: 'https://linkedin.com/in/burak-deniz-yaman-63aa263b3' },
  { key: 'yana', image: yanaImg, tag: 'Engineering', linkedin: 'https://linkedin.com/in/yanina-isak-a62191367' },
  { key: 'shuayb', image: shuaybImg, tag: 'Engineering', linkedin: 'https://linkedin.com/in/shuayb-allahverdiyev-933813291' },
  { key: 'ibrahim', image: ibrahimImg, tag: 'Marketing' },
];

/** Photo lookup keyed by lowercase first name, so DB rows without an upload still show a portrait. */
export const TEAM_PHOTO_BY_NAME: Record<string, string> = {
  zinurbek: zinurbekImg,
  umut: umutImg,
  abdulla: abdullaImg,
  yunus: yunusImg,
  abdulbaki: abdulbakiImg,
  yana: yanaImg,
  shuayb: shuaybImg,
  ibrahim: ibrahimImg,
  burak: burakImg,
  anar: anarImg,
  mehmet: mehmetBarukImg,
};
