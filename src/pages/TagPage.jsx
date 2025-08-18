import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { getPostsByTag } from '@/utils/posts';
import { updateSEO } from '@/utils/seo';

const TagPage = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedTag = decodeURIComponent(tag);
    const tagPosts = getPostsByTag(decodedTag);
    
    if (tagPosts.length === 0) {
      navigate('/404', { replace: true });
      return;
    }

    setPosts(tagPosts);
    setLoading(false);

    // Update SEO
    updateSEO({
      title: `Posts tagged "${decodedTag}"`,
      description: `Browse all posts tagged with "${decodedTag}". Find related articles and content.`,
      url: `/tag/${tag}`,
      type: 'website'
    });
  }, [tag, navigate]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const decodedTag = decodeURIComponent(tag);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Tag className="h-6 w-6" />
          <h1 className="text-3xl font-bold">
            Posts tagged "{decodedTag}"
          </h1>
        </div>
        <p className="text-muted-foreground">
          {posts.length} post{posts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default TagPage;