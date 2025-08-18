import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllTags, getRecentPosts } from '@/utils/posts';

const Sidebar = () => {
  const tags = getAllTags().slice(0, 10); // Top 10 tags
  const recentPosts = getRecentPosts(null, 5);

  return (
    <aside className="space-y-6">
      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-4 w-4" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPosts.map((post) => (
            <div key={post.slug} className="space-y-1">
              <Link
                to={`/post/${post.slug}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
              >
                {post.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="h-4 w-4" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`}>
                <Badge 
                  variant="secondary" 
                  className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tag} ({count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stay Updated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get notified about new posts and updates.
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="w-full px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            This is a demo. No emails will be sent.
          </p>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;