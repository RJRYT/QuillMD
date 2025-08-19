import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const PostCard = ({ post, showExcerpt = true, className = '', isLoading = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return <PostCardSkeleton className={className} />;
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <Card
      className={`blog-card glass-card glass-card-fallback rounded-xl shadow-neumorphic-light hover:shadow-neumorphic-medium transition-all duration-300 overflow-hidden ${className}`}
      role="article"
      aria-label={`Blog post: ${post.title}`}
    >
      {/* Cover Image */}
      {post.cover && (
        <div className="relative overflow-hidden">
          <Link to={`/post/${post.slug}`} aria-label={`Read ${post.title}`}>
            <div className="relative h-48 overflow-hidden">
              {!imageLoaded && !imageError && (
                <Skeleton className="w-full h-full absolute inset-0" />
              )}
              <img
                src={post.cover}
                alt={post.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } group-hover:scale-105`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {imageError && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <Tag className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      <CardHeader className="space-fluid-sm">
        <div className="space-y-3">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap space-fluid-xs">
              {post.tags.slice(0, 3).map((tag) => (
                <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="secondary"
                    className="text-fluid-xs px-2 py-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
              {post.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-fluid-xs px-2 py-1 rounded-full"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-fluid-xl font-bold leading-tight text-gradient-primary">
            <Link
              to={`/post/${post.slug}`}
              className="hover:text-gradient-primary-rev transition-colors duration-700"
              aria-label={`Read article: ${post.title}`}
            >
              {post.title}
            </Link>
          </h2>

          {/* Meta */}
          <div className="flex items-center space-fluid-xs text-fluid-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span aria-label={`${readingTime} minute read`}>
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Excerpt */}
      {showExcerpt && post.excerpt && (
        <CardContent className="pt-0 space-y-4">
          <p className="text-muted-foreground text-fluid-base leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="group/btn shadow-neumorphic-light hover:shadow-neumorphic-medium transition-all duration-200"
          >
            <Link to={`/post/${post.slug}`}>
              <span>Read Article</span>
              <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

// Skeleton Loader Component
const PostCardSkeleton = ({ className = '' }) => {
  return (
    <Card 
      className={`glass-card glass-card-fallback rounded-xl shadow-neumorphic-light overflow-hidden ${className}`}
      aria-busy="true"
      aria-label="Loading blog post"
    >
      {/* Cover Image Skeleton */}
      <Skeleton className="w-full h-48" />
      
      <CardHeader className="space-fluid-sm">
        <div className="space-y-3">
          {/* Tags Skeleton */}
          <div className="flex space-fluid-xs">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Meta Skeleton */}
          <div className="flex space-fluid-xs">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardHeader>

      {/* Excerpt Skeleton */}
      <CardContent className="pt-0 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </CardContent>
    </Card>
  );
};

export default PostCard;