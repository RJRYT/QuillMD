import fs from 'fs';
import fg from "fast-glob";
import matter from "gray-matter";
import dotenv from "dotenv";

dotenv.config();

const SITE_URL = process.env.VITE_SITE_URL || 'https://your-blog.com';

const getAllPosts = () => {
  const files = fg.sync("src/posts/**/*.md");

  const postModules = Object.fromEntries(
    files.map((file) => [file, fs.readFileSync(file, "utf-8")])
  );
  const posts = Object.entries(postModules).map(([path, content]) => {
    const { data, content: body } = matter(content);
    const slug = path.split("/").pop().replace(".md", "");

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      excerpt: data.excerpt || "",
      cover: data.cover || null,
      draft: data.draft || false,
      content: body,
      ...data,
    };
  });

  // Filter out drafts in production
  const filteredPosts = process.env.DEV
    ? posts
    : posts.filter((post) => !post.draft);

  // Sort by date (newest first)
  return filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

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
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${
      page.lastmod ? page.lastmod : new Date().toISOString().slice(0, 10)
    }</lastmod>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync('dist/sitemap.xml', sitemap);
  console.log('✅ Sitemap generated successfully!');
}

generateSitemap();