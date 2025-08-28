import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useAuth } from "@/contexts/AuthContext";
import { blogApi, PostStatus, type BlogPost } from "@/lib/blog-api";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Eye, 
  Trash2, 
  ArrowLeft, 
  Globe, 
  FileText,
  RefreshCw,
  Sparkles
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CreateEditPost() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState<Partial<BlogPost> | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadPost();
    }
  }, [isEditing, id]);

  const loadPost = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const postData = await blogApi.getPost(id);
      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);
      setExcerpt(postData.excerpt || "");
      setFeaturedImageUrl(postData.featuredImageUrl || "");
    } catch (error) {
      console.error("Failed to load post:", error);
      toast({
        title: "Error",
        description: "Failed to load the post. Please try again.",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const generateExcerpt = () => {
    if (!content) return;
    
    // Strip HTML tags and get first 150 characters
    const text = content.replace(/<[^>]*>/g, '');
    const generatedExcerpt = text.substring(0, 150).trim();
    setExcerpt(generatedExcerpt + (text.length > 150 ? '...' : ''));
  };

  const handleSave = async (status: PostStatus) => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }
    
    if(status === PostStatus.PUBLISHED && !content.trim()) {
        toast({
            title: "Content required",
            description: "Please enter content for your post to publish.",
            variant: "destructive"
        });
        return;
    }

    if (status === PostStatus.DRAFT) setIsSaving(true);
    if (status === PostStatus.PUBLISHED) setIsPublishing(true);

    try {
      const postData = {
        title: title.trim(),
        content,
        excerpt: excerpt.trim() || undefined,
        status,
        featuredImageUrl: featuredImageUrl.trim() || undefined,
      };

      if (isEditing && id) {
        const updatedPost = await blogApi.updatePost(id, { id, ...postData });
        setPost(updatedPost);
        toast({
          title: status === PostStatus.PUBLISHED ? "Post published" : "Draft saved",
          description: `Your post has been successfully ${status === PostStatus.PUBLISHED ? 'published' : 'saved'}.`,
        });
        if(status === PostStatus.PUBLISHED) {
          navigate(`/posts/${updatedPost.id}`);
        }
      } else {
        const newPost = await blogApi.createPost(postData);
        toast({
          title: status === PostStatus.PUBLISHED ? "Post created" : "Draft created",
          description: `Your post has been successfully ${status === PostStatus.PUBLISHED ? 'published' : 'created'}.`,
        });
        navigate(`/dashboard/edit/${newPost.id}`);
      }
    } catch (error: any) {
      console.error(`Failed to ${status === PostStatus.PUBLISHED ? 'publish' : 'save'} post:`, error);
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to save your post. Please try again.`,
        variant: "destructive",
      });
    } finally {
      if (status === PostStatus.DRAFT) setIsSaving(false);
      if (status === PostStatus.PUBLISHED) setIsPublishing(false);
    }
  };


  const deletePost = async () => {
    if (!isEditing || !id) return;
    
    setIsDeleting(true);
    try {
      await blogApi.deletePost(id);
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-bold">
              {isEditing ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your existing post" : "Write and publish your thoughts"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">
                    Post Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your post title..."
                    className="mt-2 text-lg font-heading"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Content</Label>
                  <div className="mt-2">
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Start writing your story..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => handleSave(PostStatus.PUBLISHED)}
                disabled={isPublishing || !title.trim() || !content.trim()}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Publish Post
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleSave(PostStatus.DRAFT)}
                disabled={isSaving || !title.trim()}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Post Details */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Post Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <div className="flex mt-1">
                  <Input
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description..."
                    className="rounded-r-none"
                  />
                  <Button
                    variant="outline"
                    onClick={generateExcerpt}
                    className="rounded-l-none border-l-0"
                    size="sm"
                    title="Generate Excerpt"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">
                      {title || "Untitled Post"}
                    </DialogTitle>
                    <DialogDescription>
                      Preview of how your post will appear to readers
                    </DialogDescription>
                  </DialogHeader>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {excerpt && (
                      <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                        {excerpt}
                      </p>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                </DialogContent>
              </Dialog>

              {isEditing && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        your post and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deletePost}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
