export interface ExternalCourse {
  id: string;
  slug: string;
  title_en: string;
  title_tr: string;
  title_ru: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_tr: string;
  subtitle_ru: string;
  subtitle_ar: string;
  description_en: string;
  description_tr: string;
  description_ru: string;
  description_ar: string;
  hero_image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  is_free: boolean;
  rating: number;
  total_reviews: number;
  total_enrollments: number;
  duration_hours: number;
  instructor: {
    name: string;
    title: string;
  };
  category: {
    name_en: string;
    name_tr: string;
    name_ru: string;
    name_ar: string;
    icon: string;
  };
  tags: string[];
  isExternal: true;
  externalUrl: string;
  source: string;
}

export const externalCourses: ExternalCourse[] = [
  {
    id: 'mit-blockchain-money',
    slug: 'blockchain-and-money',
    title_en: 'Blockchain and Money',
    title_tr: 'Blockchain ve Para',
    title_ru: 'Блокчейн и деньги',
    title_ar: 'البلوكشين والمال',
    subtitle_en: 'MIT OpenCourseWare - Prof. Gary Gensler',
    subtitle_tr: 'MIT OpenCourseWare - Prof. Gary Gensler',
    subtitle_ru: 'MIT OpenCourseWare - Проф. Гэри Генслер',
    subtitle_ar: 'MIT OpenCourseWare - البروفيسور غاري جينسلر',
    description_en: 'Comprehensive course on blockchain technology, cryptocurrencies, and their impact on money and financial systems. Taught by Prof. Gary Gensler, former SEC Chairman.',
    description_tr: 'Blockchain teknolojisi, kripto para birimleri ve bunların para ve finansal sistemler üzerindeki etkisi hakkında kapsamlı kurs. Eski SEC Başkanı Prof. Gary Gensler tarafından veriliyor.',
    description_ru: 'Всесторонний курс о технологии блокчейн, криптовалютах и их влиянии на денежные и финансовые системы. Преподает проф. Гэри Генслер, бывший председатель SEC.',
    description_ar: 'دورة شاملة حول تقنية البلوكشين والعملات المشفرة وتأثيرها على الأنظمة المالية والنقدية. يدرّسها البروفيسور غاري جينسلر، رئيس هيئة الأوراق المالية السابق.',
    hero_image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    level: 'intermediate',
    language: 'en',
    is_free: true,
    rating: 4.9,
    total_reviews: 1247,
    total_enrollments: 15683,
    duration_hours: 24,
    instructor: {
      name: 'Prof. Gary Gensler',
      title: 'Former SEC Chairman, MIT Sloan Professor'
    },
    category: {
      name_en: 'Blockchain',
      name_tr: 'Blockchain',
      name_ru: 'Блокчейн',
      name_ar: 'البلوكشين',
      icon: '⛓️'
    },
    tags: ['Blockchain', 'Cryptocurrency', 'Bitcoin', 'Finance', 'Economics', 'MIT'],
    isExternal: true,
    externalUrl: '/education/blockchain-and-money',
    source: 'MIT OpenCourseWare'
  }
];
