import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { blogApi, type BlogPost } from "@/lib/blog-api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Edit,
  RefreshCw,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const postData = await blogApi.getPost(id);
      setPost(postData);
    } catch (error: any) {
      console.error("Failed to load post:", error);
      setError(error.response.data?.status === 404 ? "Post not found" : "Failed to load post");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const isAuthor = user && post && user.id === post.author.id;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">
            {error || "Post not found"}
          </h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        {post.featuredImageUrl && (
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
        
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Posts
                </Link>
              </Button>
              
              {isAuthor && (
                <Button variant="outline" asChild>
                  <Link to={`/dashboard/edit/${post.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Post
                  </Link>
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Post Status */}
              {post.status === "DRAFT" && (
                <Badge variant="secondary" className="mb-4">
                  Draft
                </Badge>
              )}

              {/* Title */}
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 italic">
                  {post.excerpt}
                </p>
              )}

              {/* Author and Meta Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.author.avatarUrl} alt={post.author.username} />
                    <AvatarFallback>
                      {post.author.firstName[0]}{post.author.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">
                      {post.author.firstName} {post.author.lastName}
                    </p>
                    <p className="text-muted-foreground">
                      @{post.author.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{getReadingTime(post.content)} min read</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comment
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              <Separator />
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="prose-headings:font-heading prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-blockquote:border-l-primary prose-blockquote:bg-muted prose-blockquote:not-italic prose-pre:bg-muted prose-pre:border prose-pre:border-border"
            />
          </article>

          {/* Author Bio Section */}
          <div className="mt-16 p-8 glass-card rounded-xl">
            <div className="flex items-start space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.username} />
                <AvatarFallback className="text-lg">
                  {post.author.firstName[0]}{post.author.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-heading text-2xl font-bold mb-2">
                  {post.author.firstName} {post.author.lastName}
                </h3>
                <p className="text-muted-foreground mb-4">
                  @{post.author.username}
                </p>
                <p className="text-foreground">
                  A passionate writer sharing thoughts and reflections on life, technology, and creativity.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section Placeholder */}
          <div className="mt-16">
            <h3 className="font-heading text-2xl font-bold mb-8">
              Comments
            </h3>
            <div className="text-center py-12 glass-card rounded-xl">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Comments feature coming soon. Share your thoughts on social media for now!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}