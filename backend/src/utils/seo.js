export function calculateSeoScore({ title = '', excerpt = '', contentText = '', seo = {} }) {
  let score = 0;

  if (title.length >= 35 && title.length <= 70) score += 20;
  if ((seo.metaTitle || '').length >= 35 && (seo.metaTitle || '').length <= 70) score += 15;
  if ((seo.metaDescription || excerpt || '').length >= 120 && (seo.metaDescription || excerpt || '').length <= 160) score += 20;
  if ((seo.keywords || []).length >= 3) score += 15;
  if (contentText.split(/\s+/).filter(Boolean).length >= 600) score += 20;
  if (seo.ogImage) score += 10;

  return Math.min(score, 100);
}

export function structuredArticleData(blog, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    image: blog.coverImage || blog.seo?.ogImage,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'Editorial Team',
    },
    mainEntityOfPage: `${siteUrl}/blog/${blog.slug}`,
  };
}
