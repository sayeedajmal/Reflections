import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "@/components/ui/post-card";
import { Button } from "@/components/ui/button";
import { blogApi, type BlogPost, PostStatus } from "@/lib/blog-api";
import { RefreshCw, ArrowRight } from "lucide-react";

export function RecentPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await blogApi.getAllPosts();
      // Filter only published posts and show latest 6
      const publishedPosts = allPosts
        .filter(post => post.status === PostStatus.PUBLISHED)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);
      setPosts(publishedPosts);
    } catch (error) {
      console.error("Failed to load posts:", error);
      // Fallback to empty array, component will show empty state
      setPosts([]);
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

  return (
    <section id="recent-posts" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Recent Reflections
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover thoughtful insights and stories from our community of writers
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <RefreshCw className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-2xl font-semibold mb-4">No posts yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Be the first to share your thoughts and reflections with the world.
            </p>
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link to="/signup">
                Join the Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link 
                key={post.id} 
                to={`/posts/${post.id}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <div 
                  className="animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard 
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    featuredImage={post.featuredImageUrl || `https://images.unsplash.com/photo-${1500000000000 + parseInt(post.id.slice(-6), 16)}?w=800&h=600&fit=crop`}
                    author={{
                      name: `${post.author.firstName} ${post.author.lastName}`,
                      avatar: post.author.avatarUrl || `https://images.unsplash.com/photo-${1400000000000 + parseInt(post.author.id.slice(-6), 16)}?w=100&h=100&fit=crop&crop=face`
                    }}
                    publishedAt={formatDate(post.createdAt)}
                    status={post.status}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="text-center mt-16">
            <Button variant="outline" size="lg" asChild>
              <Link to="/posts">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}