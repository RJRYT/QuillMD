/**
 * Client-side search using Fuse.js
 * Provides fuzzy search across post titles, excerpts, tags, and content
 */

import Fuse from 'fuse.js';
import { getAllPosts } from './posts.js';
import { extractTextFromMarkdown } from './markdown.js';

// Fuse.js configuration for optimal blog search
const fuseOptions = {
  includeScore: true,
  threshold: 0.4, // Lower = more strict matching
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [
    {
      name: 'title',
      weight: 0.4
    },
    {
      name: 'excerpt', 
      weight: 0.3
    },
    {
      name: 'tags',
      weight: 0.2
    },
    {
      name: 'searchableContent',
      weight: 0.1
    }
  ]
};

let fuseInstance = null;

/**
 * Initialize or update the search index
 */
function initializeSearchIndex() {
  const posts = getAllPosts();
  
  // Prepare posts for search with searchable content
  const searchablePosts = posts.map(post => ({
    ...post,
    searchableContent: extractTextFromMarkdown(post.content)
  }));

  fuseInstance = new Fuse(searchablePosts, fuseOptions);
}

/**
 * Search posts by query
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Array} Array of search results with scores
 */
export function searchPosts(query, limit = 10) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  // Initialize search index if not already done
  if (!fuseInstance) {
    initializeSearchIndex();
  }

  const results = fuseInstance.search(query, { limit });
  
  // Return results with posts and relevance scores
  return results.map(result => ({
    post: result.item,
    score: result.score,
    relevance: (1 - result.score) * 100 // Convert to percentage relevance
  }));
}

/**
 * Get search suggestions based on partial query
 * @param {string} query - Partial search query
 * @param {number} limit - Maximum number of suggestions
 * @returns {Array} Array of suggested search terms
 */
export function getSearchSuggestions(query, limit = 5) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const posts = getAllPosts();
  const suggestions = new Set();

  posts.forEach(post => {
    // Add matching titles
    if (post.title.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(post.title);
    }

    // Add matching tags
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, limit);
}

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} Text with highlighted terms
 */
export function highlightSearchTerms(text, query) {
  if (!query || !text) return text;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-accent/20 px-1 rounded-sm">$1</mark>');
  });
  
  return highlightedText;
}