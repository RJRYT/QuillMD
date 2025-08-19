import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Rss } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-6">
          {/* Logo and Description */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/brand/quillmd-mark.svg" 
                alt="QuillMD" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gradient-primary">QuillMD</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A modern markdown-powered blogging platform. 
              Write, publish, and share your thoughts with the world.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a 
              href="/rss.xml" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              RSS
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t">
            <p className="text-xs text-muted-foreground">
              © {currentYear} QuillMD. Powered by React, Vite, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;