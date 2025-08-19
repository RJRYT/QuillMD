# QuillMD

A modern, markdown-powered blogging platform built with React, Vite, and Tailwind CSS. No backend required - all content is stored as markdown files and processed at build time.

## ✨ Features

- **📝 Markdown-based content** - Write posts in markdown with YAML frontmatter
- **🔍 Client-side search** - Fuzzy search with Fuse.js across all content
- **📱 Progressive Web App** - Installable with offline support
- **🎨 Dark mode** - Toggle theme with localStorage persistence
- **🚀 SEO optimized** - Dynamic meta tags, sitemap, and RSS feed
- **📊 Admin interface** - Built-in post editor with draft management
- **⚡ Fast performance** - Static generation with Vite
- **📐 Responsive design** - Mobile-first with Tailwind CSS

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd quillmd

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate sitemap and RSS
npm run generate-sitemap
npm run generate-rss

# Run tests
npm test
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
├── pages/              # Page components
├── posts/              # Markdown blog posts
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── __tests__/          # Test files

public/
├── images/             # Static images
├── manifest.webmanifest # PWA manifest
├── sw.js              # Service worker
└── offline.html       # Offline fallback page
```

## ✍️ Adding New Posts

1. Create a new `.md` file in `src/posts/`
2. Add YAML frontmatter:

```yaml
---
title: "Your Post Title"
date: "2025-08-01T10:00:00.000Z"
tags: ["React", "JavaScript"]
excerpt: "Brief description"
cover: "/images/cover.jpg"
slug: "your-post-slug"
draft: false
---

# Your Post Content

Write your content here in markdown...
```

3. Add images to `public/images/`
4. Build and deploy

## 🛠️ Admin Interface

Visit `/admin` to use the built-in post editor:

- Create and edit posts with live preview
- Save drafts locally (IndexedDB)
- Export posts as markdown files
- Manage existing drafts

**Note:** Drafts are saved locally in your browser. To publish, export the markdown file and add it to `src/posts/`.

## 📱 PWA Features

- **Offline support** - Cached content available without internet
- **Install prompt** - Add to home screen on mobile devices
- **Background sync** - Ready for future enhancements
- **Push notifications** - Framework in place for notifications

## 🎯 SEO & Performance

- **Dynamic meta tags** - Unique title, description, and social media tags per page
- **Structured data** - JSON-LD for better search engine understanding
- **Sitemap generation** - Automatic sitemap.xml creation
- **RSS feed** - Auto-generated RSS feed
- **Image optimization** - Lazy loading and responsive images
- **Code splitting** - Optimized bundle sizes

## 🚀 Deployment

### GitHub Pages

1. Set `base: '/your-repo-name/'` in `vite.config.js`
2. Build: `npm run build`
3. Deploy `dist/` folder to `gh-pages` branch

### Vercel

1. Connect your GitHub repository
2. Vercel auto-detects Vite projects
3. Automatic deployments on push

### Netlify

1. Build: `npm run build`
2. Drag and drop `dist/` folder to Netlify
3. Or connect to Git for automatic deployments

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME="Your Blog Name"
VITE_AUTHOR_NAME="Your Name"
```

### Customization

- **Colors**: Edit design tokens in `src/index.css`
- **Components**: Customize shadcn/ui components
- **Layout**: Modify `src/components/Layout.jsx`
- **SEO**: Update meta tags in `src/utils/seo.js`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Build Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate-sitemap` - Generate sitemap.xml
- `npm run generate-rss` - Generate RSS feed
- `npm test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own blog!

## 🆘 Support

- Check the [issues](https://github.com/your-repo/issues) for common problems
- Create a new issue for bugs or feature requests
- Read the [documentation](https://vitejs.dev/) for Vite-specific questions

---

Built with ❤️ using React, Vite, and Tailwind CSS