import fs from 'fs';
import { getAllPosts } from '../src/utils/posts.js';

const SITE_URL = process.env.VITE_SITE_URL || 'https://your-blog.com';
const SITE_NAME = 'Backendless Blog';
const SITE_DESCRIPTION = 'A modern backendless blog built with React, Vite, and Tailwind CSS';

function generateRSS() {
  const posts = getAllPosts().slice(0, 20); // Latest 20 posts

  const rssItems = posts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${SITE_URL}/post/${post.slug}</link>
      <guid>${SITE_URL}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <description>${SITE_DESCRIPTION}</description>
    <link>${SITE_URL}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync('dist/rss.xml', rss);
  console.log('✅ RSS feed generated successfully!');
}

generateRSS();