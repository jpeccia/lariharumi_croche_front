import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function SEOHead({
  title = 'Crochê da Lari - Peças Únicas e Personalizadas',
  description = 'Descubra peças de crochê únicas e personalizadas feitas à mão com muito carinho pela Larissa Harumi. Catálogo completo, cuidados especiais, encomendas personalizadas e muito mais!',
  keywords = ['crochê', 'artesanato', 'peças únicas', 'personalizadas', 'Larissa Harumi', 'feito à mão', 'crochê personalizado', 'artesanato brasileiro', 'peças de crochê', 'encomendas', 'handmade', 'craft'],
  image = '/logo.png',
  url,
  type = 'website',
  author = 'Larissa Harumi',
  publishedTime,
  modifiedTime,
  section,
  tags
}: SEOHeadProps) {
  const fullTitle = title.includes('Crochê da Lari') ? title : `${title} | Crochê da Lari`;
  const fullUrl = url ? `https://larifazcroche.vercel.app${url}` : 'https://larifazcroche.vercel.app';
  const fullImage = image.startsWith('http') ? image : `https://larifazcroche.vercel.app${image}`;

  return (
    <Helmet>
      {/* Meta tags básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Language and region */}
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR" />
      <meta name="geo.placename" content="Brasil" />
      
      {/* Additional SEO meta tags */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Crochê da Lari" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      <meta property="twitter:creator" content="@larifazcroche" />
      <meta property="twitter:site" content="@larifazcroche" />

      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
        </>
      )}

      {/* Product specific */}
      {type === 'product' && (
        <>
          <meta property="product:brand" content="Crochê da Lari" />
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
          <meta property="product:price:currency" content="BRL" />
        </>
      )}

      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Crochê da Lari" />

      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'product' ? 'Product' : 'WebSite',
          "name": fullTitle,
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "author": {
            "@type": "Person",
            "name": author,
            "url": "https://larifazcroche.vercel.app/contact"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Crochê da Lari",
            "url": "https://larifazcroche.vercel.app",
            "logo": {
              "@type": "ImageObject",
              "url": "https://larifazcroche.vercel.app/logo.png"
            },
            "sameAs": [
              "https://www.instagram.com/larifazcroche"
            ]
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://larifazcroche.vercel.app/catalog?search={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          ...(type === 'product' && {
            "brand": "Crochê da Lari",
            "availability": "https://schema.org/InStock",
            "condition": "https://schema.org/NewCondition",
            "category": "Handmade Crafts"
          })
        })}
      </script>
    </Helmet>
  );
}

// Hook para facilitar o uso
export function useSEO(config: SEOHeadProps) {
  return <SEOHead {...config} />;
}

