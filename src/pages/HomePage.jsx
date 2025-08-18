import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import { getPaginatedPosts } from '@/utils/posts';
import { updateSEO } from '@/utils/seo';

const HomePage = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page) || 1;
  const postsPerPage = 6;

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
        <section className="text-center py-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Backendless Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A modern blog built with React, Vite, and Tailwind CSS. 
              No backend required, all content stored as markdown files.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about">
                <Button size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Create Post
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {currentPage > 1 ? `Latest Posts - Page ${currentPage}` : 'Latest Posts'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {totalPosts} post{totalPosts !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          {hasPrevPage && (
            <Link to={prevPage === 1 ? '/' : `/page/${prevPage}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
          )}

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link key={pageNum} to={pageNum === 1 ? '/' : `/page/${pageNum}`}>
                <Button
                  variant={pageNum === currentPage ? 'default' : 'outline'}
                  size="sm"
                  className="w-10 h-10"
                >
                  {pageNum}
                </Button>
              </Link>
            ))}
          </div>

          {hasNextPage && (
            <Link to={`/page/${nextPage}`}>
              <Button variant="outline" className="flex items-center gap-2">
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