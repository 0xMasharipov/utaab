import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  path: string; // e.g. "/about"
  ogType?: 'website' | 'article';
  image?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SITE = 'https://utaab.org';

export const SEO = ({ title, description, path, ogType = 'website', image, jsonLd }: SEOProps) => {
  const url = `${SITE}${path}`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:url" content={url} />
      {image && <meta name="twitter:image" content={image} />}
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
