import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import { getPaginatedPosts } from '@/utils/posts';
import { updateSEO } from '@/utils/seo';

const HomePage = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page) || 1;
  const postsPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const {
    posts,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    totalPosts
  } = getPaginatedPosts(currentPage, postsPerPage);

  useEffect(() => {
    updateSEO({
      title: currentPage > 1 ? `Page ${currentPage}` : '',
      description: 'A modern backendless blog built with React, Vite, and Tailwind CSS. Discover articles about web development, technology, and more.',
      url: currentPage > 1 ? `/page/${currentPage}` : '/',
      type: 'website'
    });
    
    // Simulate loading for skeleton effect
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // If page number is invalid, redirect to home
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      navigate('/', { replace: true });
    }
  }, [currentPage, totalPages, navigate]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Welcome to Backendless Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          No posts found. Add some posts to get started!
        </p>
        <Link to="/admin">
          <Button>Create Your First Post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section - Only on first page */}
      {currentPage === 1 && (
        <section className="text-center space-fluid-xl glass-card glass-card-fallback rounded-2xl shadow-neumorphic-medium border overflow-hidden">
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-fluid-4xl font-bold mb-6 text-gradient-primary leading-tight">
              Welcome to Backendless Blog
            </h1>
            <p className="text-fluid-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              A modern blog built with React, Vite, and Tailwind CSS featuring glassmorphism design. 
              No backend required, all content stored as markdown files with full PWA support.
            </p>
            <div className="flex flex-col sm:flex-row space-fluid-md justify-center">
              <Link to="/about">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto shadow-neumorphic-medium hover:shadow-neumorphic-heavy transition-all duration-200"
                >
                  Learn More
                </Button>
              </Link>
              <Link to="/admin">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto shadow-neumorphic-light hover:shadow-neumorphic-medium transition-all duration-200"
                >
                  Create Post
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-fluid-3xl font-bold text-gradient-primary">
            {currentPage > 1 ? `Latest Posts - Page ${currentPage}` : 'Latest Posts'}
          </h1>
          <p className="text-muted-foreground mt-2 text-fluid-base">
            {totalPosts} post{totalPosts !== 1 ? 's' : ''} total
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 glass-card glass-card-fallback rounded-lg p-1 shadow-neumorphic-light">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'blog-grid' 
          : 'flex flex-col space-fluid-md'
        }
        container-lg
      `}>
        {isLoading ? (
          // Show skeleton loaders
          Array.from({ length: postsPerPage }).map((_, index) => (
            <PostCard 
              key={`skeleton-${index}`} 
              isLoading={true}
              className={viewMode === 'list' ? 'max-w-full' : ''}
            />
          ))
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.slug} 
              post={post} 
              className={viewMode === 'list' ? 'max-w-full blog-card-responsive' : ''}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-center space-fluid-md pt-8">
          {hasPrevPage && (
            <Link to={prevPage === 1 ? '/' : `/page/${prevPage}`}>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 shadow-neumorphic-light hover:shadow-neumorphic-medium transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
          )}

          <div className="flex items-center space-fluid-xs glass-card glass-card-fallback rounded-lg p-1 shadow-neumorphic-light">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else {
                // Smart pagination: show first, last, current, and nearby pages
                if (i === 0) pageNum = 1;
                else if (i === 6) pageNum = totalPages;
                else if (currentPage <= 4) pageNum = i + 1;
                else if (currentPage >= totalPages - 3) pageNum = totalPages - 6 + i;
                else pageNum = currentPage - 3 + i;
              }
              
              const isEllipsis = (pageNum === 1 && currentPage > 4 && i === 1) || 
                               (pageNum === totalPages && currentPage < totalPages - 3 && i === 5);
              
              if (isEllipsis) {
                return <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">...</span>;
              }
              
              return (
                <Link key={pageNum} to={pageNum === 1 ? '/' : `/page/${pageNum}`}>
                  <Button
                    variant={pageNum === currentPage ? 'default' : 'ghost'}
                    size="sm"
                    className="w-10 h-10 text-fluid-sm"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}
          </div>

          {hasNextPage && (
            <Link to={`/page/${nextPage}`}>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 shadow-neumorphic-light hover:shadow-neumorphic-medium transition-all duration-200"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;