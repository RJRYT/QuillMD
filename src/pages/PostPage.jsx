import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Tag, Share2, ArrowLeft, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PostCard from '@/components/PostCard';
import { getPostBySlug, getRecentPosts } from '@/utils/posts';
import { renderMarkdown } from '@/utils/markdown';
import { updateSEO, addStructuredData } from '@/utils/seo';
import { toast } from '@/hooks/use-toast';

// Import syntax highlighting styles
import 'highlight.js/styles/github-dark.css';

const PostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const foundPost = getPostBySlug(slug);
    
    if (!foundPost) {
      navigate('/404', { replace: true });
      return;
    }

    setPost(foundPost);
    setLoading(false);

    // Update SEO
    updateSEO({
      title: foundPost.title,
      description: foundPost.excerpt,
      image: foundPost.cover,
      url: `/post/${foundPost.slug}`,
      type: 'article',
      publishedTime: foundPost.date,
      modifiedTime: foundPost.date,
      tags: foundPost.tags
    });

    // Add structured data
    addStructuredData(foundPost);

    // Get related posts (exclude current post)
    const recent = getRecentPosts(foundPost.slug, 3);
    setRelatedPosts(recent);
  }, [slug, navigate]);

  const handleShare = async (platform = 'native') => {
    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt;

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        toast({ title: 'Shared successfully!' });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast({ title: 'Share failed', variant: 'destructive' });
        }
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied to clipboard!' });
      } catch (err) {
        toast({ title: 'Failed to copy link', variant: 'destructive' });
      }
    }
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${text}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-sm animate-pulse" />
        <div className="h-4 bg-muted rounded-sm animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded-sm animate-pulse w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-sm animate-pulse" />
          <div className="h-4 bg-muted rounded-sm animate-pulse" />
          <div className="h-4 bg-muted rounded-sm animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Button>
      </Link>

      {/* Article Header */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <header className="space-y-6 not-prose">
          {/* Cover Image */}
          {post.cover && (
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => handleShare('native')} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={() => handleSocialShare('twitter')} variant="outline" size="sm">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button onClick={() => handleSocialShare('facebook')} variant="outline" size="sm">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button onClick={() => handleSocialShare('linkedin')} variant="outline" size="sm">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          <Separator />
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="space-y-6">
          <Separator />
          <h2 className="text-2xl font-bold">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <PostCard 
                key={relatedPost.slug} 
                post={relatedPost} 
                showExcerpt={false}
                className="h-full"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PostPage;