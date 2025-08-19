/**
 * SEO utilities for dynamic meta tags and structured data
 */

/**
 * Update document title and meta tags
 * @param {Object} options - SEO options
 */
export function updateSEO({
  title = '',
  description = '',
  image = '',
  url = '',
  type = 'website',
  publishedTime = '',
  modifiedTime = '',
  tags = [],
  author = 'Blog Author'
} = {}) {
  const baseTitle = 'QuillMD';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const siteUrl = window.location.origin;
  const fullUrl = url ? `${siteUrl}${url}` : window.location.href;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}/images/og-default.jpg`;

  // Update title
  document.title = fullTitle;

  // Update or create meta tags
  const metaTags = [
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: fullUrl },
    { property: 'og:image', content: fullImage },
    { property: 'og:site_name', content: baseTitle },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImage },
    { name: 'author', content: author },
    { name: 'keywords', content: tags.join(', ') }
  ];

  // Add article-specific meta tags
  if (type === 'article') {
    metaTags.push(
      { property: 'article:author', content: author },
      { property: 'article:published_time', content: publishedTime },
      { property: 'article:modified_time', content: modifiedTime }
    );

    tags.forEach(tag => {
      metaTags.push({ property: 'article:tag', content: tag });
    });
  }

  // Add canonical URL
  metaTags.push({ rel: 'canonical', href: fullUrl });

  metaTags.forEach(({ name, property, rel, content, href }) => {
    const selector = name ? `meta[name="${name}"]` : 
                    property ? `meta[property="${property}"]` :
                    `link[rel="${rel}"]`;
    
    let element = document.querySelector(selector);
    
    if (!element) {
      element = document.createElement(name || property ? 'meta' : 'link');
      if (name) element.setAttribute('name', name);
      if (property) element.setAttribute('property', property);
      if (rel) element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    
    if (content) element.setAttribute('content', content);
    if (href) element.setAttribute('href', href);
  });
}

/**
 * Generate JSON-LD structured data for articles
 * @param {Object} post - Post data
 * @returns {string} JSON-LD script content
 */
export function generateArticleStructuredData(post) {
  const siteUrl = window.location.origin;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover
      ? `${siteUrl}${post.cover}`
      : `${siteUrl}/brand/quillmd-horizontal.svg`,
    author: {
      "@type": "Person",
      name: "Blog Author",
    },
    publisher: {
      "@type": "Organization",
      name: "QuillMD",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/quillmd-mark.svg`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/post/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return JSON.stringify(structuredData);
}

/**
 * Add structured data script to page
 * @param {Object} post - Post data
 */
export function addStructuredData(post) {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = generateArticleStructuredData(post);
  document.head.appendChild(script);
}