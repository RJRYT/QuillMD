import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, FileText, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { updateSEO } from '@/utils/seo';

// IndexedDB utilities for draft storage
const DB_NAME = 'BlogDrafts';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';

class DraftStorage {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveDraft(draft) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        ...draft,
        id: draft.id || Date.now().toString(),
        timestamp: new Date().toISOString()
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getDrafts() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteDraft(id) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [cover, setCover] = useState('');
  const [content, setContent] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [storage] = useState(() => new DraftStorage());

  useEffect(() => {
    updateSEO({
      title: 'Admin Panel',
      description: 'Create and manage blog posts with the built-in admin interface.',
      url: '/admin',
      type: 'website'
    });

    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const savedDrafts = await storage.getDrafts();
      setDrafts(savedDrafts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  const getCurrentDraft = () => ({
    title,
    slug: slug || generateSlug(title),
    excerpt,
    tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    cover,
    content,
    date: new Date().toISOString()
  });

  const saveDraft = async () => {
    try {
      const draft = getCurrentDraft();
      if (!draft.title) {
        toast({ title: 'Title is required', variant: 'destructive' });
        return;
      }

      await storage.saveDraft(draft);
      await loadDrafts();
      toast({ title: 'Draft saved successfully!' });
    } catch (error) {
      toast({ title: 'Failed to save draft', variant: 'destructive' });
    }
  };

  const loadDraft = (draft) => {
    setTitle(draft.title);
    setSlug(draft.slug);
    setExcerpt(draft.excerpt);
    setTags(draft.tags.join(', '));
    setCover(draft.cover || '');
    setContent(draft.content);
  };

  const deleteDraft = async (id) => {
    try {
      await storage.deleteDraft(id);
      await loadDrafts();
      toast({ title: 'Draft deleted successfully!' });
    } catch (error) {
      toast({ title: 'Failed to delete draft', variant: 'destructive' });
    }
  };

  const exportMarkdown = () => {
    const draft = getCurrentDraft();
    const frontmatter = `---
title: "${draft.title}"
date: "${draft.date}"
tags: [${draft.tags.map(tag => `"${tag}"`).join(', ')}]
excerpt: "${draft.excerpt}"
cover: "${draft.cover}"
slug: "${draft.slug}"
draft: false
---

${draft.content}`;

    const blob = new Blob([frontmatter], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.slug || 'post'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: 'Markdown file downloaded!' });
  };

  const clearForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setTags('');
    setCover('');
    setContent('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">
          Create and manage blog posts. Drafts are saved locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Post Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Post title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of your post"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="React, JavaScript, Blog"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Image</label>
                  <Input
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder="/images/cover.jpg"
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Content</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isPreview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
                
                {isPreview ? (
                  <div className="border rounded-md p-4 min-h-[300px] prose prose-sm dark:prose-invert max-w-none">
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                    ) : (
                      <p className="text-muted-foreground">No content to preview</p>
                    )}
                  </div>
                ) : (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content in markdown..."
                    rows={15}
                    className="font-mono"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={saveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={exportMarkdown} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export MD
                </Button>
                <Button onClick={clearForm} variant="outline">
                  Clear Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Saved Drafts */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Drafts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No drafts saved yet.</p>
              ) : (
                drafts.map((draft) => (
                  <div key={draft.id} className="border rounded-lg p-3 space-y-2">
                    <h3 className="font-medium text-sm">{draft.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(draft.timestamp).toLocaleDateString()}
                    </p>
                    {draft.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {draft.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {draft.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{draft.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadDraft(draft)}
                        className="h-7 px-2 text-xs"
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteDraft(draft.id)}
                        className="h-7 px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground">Adding Posts:</h4>
                <p>1. Fill in the post details</p>
                <p>2. Write content in markdown</p>
                <p>3. Export as .md file</p>
                <p>4. Add file to src/posts/ directory</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-foreground">Draft Storage:</h4>
                <p>Drafts are saved locally in your browser using IndexedDB.</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-foreground">Cover Images:</h4>
                <p>Store images in public/images/ and reference as /images/filename.jpg</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;