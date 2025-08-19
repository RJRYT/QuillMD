import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import { searchPosts, getSearchSuggestions } from '@/utils/search';
import { updateSEO } from '@/utils/seo';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const searchResults = searchPosts(searchQuery, 20);
    setResults(searchResults);
    setHasSearched(true);
    setLoading(false);

    // Update URL
    setSearchParams({ q: searchQuery });

    // Update SEO
    updateSEO({
      title: `Search results for "${searchQuery}"`,
      description: `Search results for "${searchQuery}". Find relevant blog posts and articles.`,
      url: `/search?q=${encodeURIComponent(searchQuery)}`,
      type: 'website'
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Get suggestions for non-empty queries
    if (value.trim().length >= 2) {
      const searchSuggestions = getSearchSuggestions(value, 5);
      setSuggestions(searchSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    performSearch(suggestion);
  };

  // Perform search on component mount if query exists
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search Posts</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search posts, tags, and content..."
              value={query}
              onChange={handleInputChange}
              className="pl-9 pr-10 h-12 text-lg"
              autoFocus
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Searching...</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results for "{query}"
            </h2>
            <p className="text-muted-foreground">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No posts found matching your search.
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or browse all posts.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search Results */}
              <div className="grid grid-cols-1 gap-6">
                {results.map(({ post, relevance }) => (
                  <div key={post.slug} className="relative">
                    <PostCard post={post} />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm">
                      {Math.round(relevance)}% match
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">What you can search:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Post titles and content</li>
                <li>• Tags and categories</li>
                <li>• Post excerpts</li>
                <li>• Author names</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Search features:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fuzzy matching for typos</li>
                <li>• Relevance scoring</li>
                <li>• Auto-suggestions</li>
                <li>• Real-time results</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;