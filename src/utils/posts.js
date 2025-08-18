/**
 * Posts utility - loads and manages blog posts from markdown files
 * Uses Vite's import.meta.glob to load posts at build time for better performance
 */

import { Buffer } from "buffer";

if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer;
}

import matter from "gray-matter";

// Eagerly load all markdown files from posts directory
const postModules = import.meta.glob("/src/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * Parse and sort all posts
 * @returns {Array} Array of post objects sorted by date (newest first)
 */
export function getAllPosts() {
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
  const filteredPosts = import.meta.env.DEV
    ? posts
    : posts.filter((post) => !post.draft);

  // Sort by date (newest first)
  return filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by slug
 * @param {string} slug - Post slug
 * @returns {Object|null} Post object or null if not found
 */
export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Get posts filtered by tag
 * @param {string} tag - Tag to filter by
 * @returns {Array} Array of posts with the specified tag
 */
export function getPostsByTag(tag) {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get paginated posts
 * @param {number} page - Page number (1-based)
 * @param {number} perPage - Posts per page
 * @returns {Object} Object with posts array, current page, total pages, etc.
 */
export function getPaginatedPosts(page = 1, perPage = 10) {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    currentPage: page,
    totalPages,
    totalPosts,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
}

/**
 * Get all unique tags from all posts
 * @returns {Array} Array of unique tags with post counts
 */
export function getAllTags() {
  const posts = getAllPosts();
  const tagCounts = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get recent posts (excluding current post)
 * @param {string} excludeSlug - Slug to exclude from results
 * @param {number} limit - Number of posts to return
 * @returns {Array} Array of recent posts
 */
export function getRecentPosts(excludeSlug = null, limit = 5) {
  const posts = getAllPosts();
  const filtered = excludeSlug
    ? posts.filter((post) => post.slug !== excludeSlug)
    : posts;

  return filtered.slice(0, limit);
}
