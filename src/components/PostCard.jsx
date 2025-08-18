import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PostCard = ({ post, showExcerpt = true, className = '' }) => {
  const readingTime = Math.ceil(post.content.split(' ').length / 200); // Approximate reading time

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Cover Image */}
      {post.cover && (
        <div className="relative overflow-hidden rounded-t-lg">
          <Link to={`/post/${post.slug}`}>
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="space-y-2">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`}>
                  <Badge 
                    variant="secondary" 
                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold leading-tight">
            <Link 
              to={`/post/${post.slug}`}
              className="text-foreground hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </h2>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Excerpt */}
      {showExcerpt && post.excerpt && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground line-clamp-3 mb-3">
            {post.excerpt}
          </p>
          <Link 
            to={`/post/${post.slug}`}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            Read more →
          </Link>
        </CardContent>
      )}
    </Card>
  );
};

export default PostCard;