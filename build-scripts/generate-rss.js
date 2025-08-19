import fs from "fs";
import fg from "fast-glob";
import matter from "gray-matter";
import dotenv from "dotenv";

dotenv.config();

const SITE_URL = process.env.VITE_SITE_URL || "https://your-blog.com";
const SITE_NAME = "QuillMD";
const SITE_DESCRIPTION =
  "A modern markdown-powered blogging platform built with React, Vite, and Tailwind CSS";

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

function generateRSS() {
  const posts = getAllPosts().slice(0, 20); // Latest 20 posts

  const rssItems = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${SITE_URL}/post/${post.slug}</link>
      <guid>${SITE_URL}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

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

  fs.writeFileSync("dist/rss.xml", rss);
  console.log("✅ RSS feed generated successfully!");
}

generateRSS();
