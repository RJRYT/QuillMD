/**
 * Markdown renderer with syntax highlighting
 * Uses markdown-it for parsing and highlight.js for code syntax highlighting
 */

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

// Configure markdown-it with syntax highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="hljs language-${lang}">` +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    return `<pre class="hljs"><code class="hljs">` + 
           md.utils.escapeHtml(str) + 
           '</code></pre>';
  }
});

/**
 * Render markdown to HTML
 * @param {string} content - Markdown content
 * @returns {string} Rendered HTML
 */
export function renderMarkdown(content) {
  return md.render(content);
}

/**
 * Extract plain text from markdown (for search indexing)
 * @param {string} content - Markdown content
 * @returns {string} Plain text content
 */
export function extractTextFromMarkdown(content) {
  // Remove markdown syntax and get plain text
  return content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert links to text
    .replace(/[#*_~`]/g, '') // Remove markdown symbols
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
}