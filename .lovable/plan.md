

# Localize Hero Section & Match Image Typography

## Current State
The Hero component has hardcoded English text. The i18n locale files have a `hero` section but with old/different keys (`title`, `subtitle`, `description`, `cta`). Need to update both the locale keys and the component.

## Changes

### 1. Update locale files — new hero keys
Replace existing hero keys in all 4 locale files to match the actual hero content:

**EN:**
```json
"hero": {
  "tagline": "CONNECT · LEARN · BUILD",
  "headline": "Academic Blockchain Infrastructure for the",
  "headlineHighlight": "Next Generation",
  "description": "UTAAB builds academic blockchain infrastructure connecting universities, researchers and innovators through decentralized technologies.",
  "joinUs": "Join Us",
  "explore": "Explore Ecosystem"
}
```

**TR:**
```json
"hero": {
  "tagline": "BAĞLAN · ÖĞREN · İNŞA ET",
  "headline": "Yeni Nesil için Akademik Blokzincir",
  "headlineHighlight": "Altyapısı",
  "description": "UTAAB, üniversiteleri, araştırmacıları ve yenilikçileri merkeziyetsiz teknolojilerle birleştiren akademik blokzincir altyapısı kurar.",
  "joinUs": "Bize Katıl",
  "explore": "Ekosistemi Keşfet"
}
```

**RU:**
```json
"hero": {
  "tagline": "СВЯЗЬ · ОБУЧЕНИЕ · СОЗДАНИЕ",
  "headline": "Академическая блокчейн-инфраструктура для",
  "headlineHighlight": "нового поколения",
  "description": "UTAAB создаёт академическую блокчейн-инфраструктуру, объединяющую университеты, исследователей и новаторов через децентрализованные технологии.",
  "joinUs": "Присоединиться",
  "explore": "Исследовать экосистему"
}
```

**AR:**
```json
"hero": {
  "tagline": "تواصل · تعلّم · ابنِ",
  "headline": "البنية التحتية الأكاديمية للبلوكشين",
  "headlineHighlight": "للجيل القادم",
  "description": "يبني UTAAB بنية تحتية أكاديمية للبلوكشين تربط الجامعات والباحثين والمبتكرين من خلال التقنيات اللامركزية.",
  "joinUs": "انضم إلينا",
  "explore": "استكشف النظام البيئي"
}
```

### 2. Update `src/components/Hero.tsx`
- Import `useTranslation` from `react-i18next`
- Replace all hardcoded strings with `t('hero.tagline')`, `t('hero.headline')`, etc.
- **Typography sizing to match the image**: The image shows very large, bold headline text (~72-80px on desktop). Increase clamp to `clamp(36px, 6vw, 80px)` to better match the reference screenshot's proportions.

### Files to modify

| File | Change |
|------|--------|
| `src/i18n/locales/en.json` | Update hero keys |
| `src/i18n/locales/tr.json` | Update hero keys |
| `src/i18n/locales/ru.json` | Update hero keys |
| `src/i18n/locales/ar.json` | Update hero keys |
| `src/components/Hero.tsx` | Add i18n, use `t()` for all text |

