import fs from 'fs';
import { getAllPosts } from '../src/utils/posts.js';

const SITE_URL = process.env.VITE_SITE_URL || 'https://your-blog.com';

function generateSitemap() {
  const posts = getAllPosts();
  
  const staticPages = [
    { url: '', priority: '1.0' },
    { url: '/about', priority: '0.8' },
    { url: '/search', priority: '0.6' },
  ];

  const postPages = posts.map(post => ({
    url: `/post/${post.slug}`,
    lastmod: post.date,
    priority: '0.9'
  }));

  const allPages = [...staticPages, ...postPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('dist/sitemap.xml', sitemap);
  console.log('✅ Sitemap generated successfully!');
}

generateSitemap();