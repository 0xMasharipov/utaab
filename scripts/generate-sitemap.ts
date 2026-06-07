// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml with static routes + every published blog post.

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = 'https://utaab.org';

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/team', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/learn', changefreq: 'monthly', priority: '0.7' },
  { path: '/learn/guides', changefreq: 'monthly', priority: '0.7' },
  { path: '/learn/workshops', changefreq: 'monthly', priority: '0.6' },
  { path: '/resources', changefreq: 'monthly', priority: '0.6' },
  { path: '/whitepaper', changefreq: 'monthly', priority: '0.6' },
  { path: '/contributor-match', changefreq: 'monthly', priority: '0.6' },
  { path: '/verify-certificate', changefreq: 'monthly', priority: '0.5' },
  { path: '/education', changefreq: 'weekly', priority: '0.9' },
  { path: '/education/courses', changefreq: 'weekly', priority: '0.8' },
  { path: '/education/blockchain-and-money', changefreq: 'monthly', priority: '0.7' },
  { path: '/projects/tonra', changefreq: 'monthly', priority: '0.7' },
  { path: '/projects/ubpoint', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
];

function readDotEnv(): Record<string, string> {
  const envPath = resolve('.env');
  if (!existsSync(envPath)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

async function fetchBlogSlugs(): Promise<SitemapEntry[]> {
  const env = { ...readDotEnv(), ...process.env };
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn('[sitemap] Supabase env not found, skipping blog slugs.');
    return [];
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug,updated_at,publish_date&status=eq.published`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) {
      console.warn(`[sitemap] blog fetch failed: ${res.status}`);
      return [];
    }
    const rows = (await res.json()) as Array<{ slug: string; updated_at?: string; publish_date?: string }>;
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        lastmod: (r.updated_at || r.publish_date || '').slice(0, 10) || undefined,
        changefreq: 'monthly' as const,
        priority: '0.6',
      }));
  } catch (e) {
    console.warn('[sitemap] blog fetch error:', (e as Error).message);
    return [];
  }
}

function build(entries: SitemapEntry[]): string {
  const urls = entries.map((e) =>
    [
      '  <url>',
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n'),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

(async () => {
  const blogEntries = await fetchBlogSlugs();
  const all = [...staticEntries, ...blogEntries];
  writeFileSync(resolve('public/sitemap.xml'), build(all));
  console.log(`[sitemap] wrote ${all.length} entries (${blogEntries.length} blog posts).`);
})();
