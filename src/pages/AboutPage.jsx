import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';

const AboutPage = () => {
  useEffect(() => {
    updateSEO({
      title: 'About',
      description: 'Learn about this backendless blog built with React, Vite, and Tailwind CSS. A modern approach to content management without the complexity.',
      url: '/about',
      type: 'website'
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About This Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern, backendless blog built with React, Vite, and Tailwind CSS. 
          Demonstrating that you don't need complex infrastructure to create amazing web experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This blog is a complete demonstration of modern web development practices, 
              showcasing how to build a feature-rich content management system that runs 
              entirely in the browser.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Key Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Markdown-based content management</li>
                <li>• Client-side search with fuzzy matching</li>
                <li>• SEO optimization with dynamic meta tags</li>
                <li>• Progressive Web App capabilities</li>
                <li>• Dark mode support</li>
                <li>• Responsive design</li>
                <li>• Build-time sitemap and RSS generation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Frontend</h4>
                <p className="text-sm text-muted-foreground">React 18 with functional components and hooks</p>
              </div>
              
              <div>
                <h4 className="font-medium">Build Tool</h4>
                <p className="text-sm text-muted-foreground">Vite for lightning-fast development and optimized builds</p>
              </div>
              
              <div>
                <h4 className="font-medium">Styling</h4>
                <p className="text-sm text-muted-foreground">Tailwind CSS with custom design system</p>
              </div>
              
              <div>
                <h4 className="font-medium">Content</h4>
                <p className="text-sm text-muted-foreground">Markdown files with YAML frontmatter</p>
              </div>
              
              <div>
                <h4 className="font-medium">Search</h4>
                <p className="text-sm text-muted-foreground">Fuse.js for client-side fuzzy search</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card>
          <CardHeader>
            <CardTitle>Architecture Principles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Backendless</h4>
                <p className="text-sm text-muted-foreground">
                  No server-side code or database required. Everything runs in the browser.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Static Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Content is processed at build time for optimal performance.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">JAMstack</h4>
                <p className="text-sm text-muted-foreground">
                  JavaScript, APIs, and Markup for a modern web architecture.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Progressive Enhancement</h4>
                <p className="text-sm text-muted-foreground">
                  Works without JavaScript, enhanced with it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Want to create your own version? This blog is open source and can be easily customized.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Quick Start:</h4>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                <div>git clone &lt;repository&gt;</div>
                <div>npm install</div>
                <div>npm run dev</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Source
                </a>
              </Button>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Try Admin Panel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Options */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">GitHub Pages</h4>
              <p className="text-sm text-muted-foreground">
                Free hosting for public repositories. Automatic deployments from your repo.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Vercel</h4>
              <p className="text-sm text-muted-foreground">
                Zero-configuration deployments with automatic optimizations and global CDN.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Netlify</h4>
              <p className="text-sm text-muted-foreground">
                Drag-and-drop deployments with powerful build tools and form handling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Connect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:hello@example.com">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;