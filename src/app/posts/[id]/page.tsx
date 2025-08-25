import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getPost } from "@/app/dashboard/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cookies } from "next/headers";
import { getComments, getUser } from "@/lib/data"; // Keep for comments for now

export default async function PostPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // We need a token to fetch a post. 
  // In a real app, you might have public posts that don't require a token.
  if (!accessToken) {
    // Redirect to login or show an error
    notFound();
  }

  const post = await getPost(params.id, accessToken);

  if (!post) {
    notFound();
  }

  const author = post.author;
  // TODO: Replace with real comments from the backend when available
  const comments = getComments(post.id); 

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      <article>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 mb-8 text-muted-foreground">
          {author && (
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={author.avatarUrl || undefined} alt={`${author.firstName} ${author.lastName}`} />
                <AvatarFallback>{`${author.firstName.charAt(0)}${author.lastName.charAt(0)}`}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{author.firstName} {author.lastName}</p>
                <p className="text-sm">
                  Posted on{" "}
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {post.featuredImageUrl && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              data-ai-hint="blog post image"
            />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 ql-editor"
           dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <Separator className="my-12" />

      <section className="mt-12">
        <h2 className="text-3xl font-bold font-headline mb-8 flex items-center">
          <MessageCircle className="mr-3 h-7 w-7 text-primary" /> Comments ({comments.length})
        </h2>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label htmlFor="comment" className="font-semibold">Leave a comment</Label>
              <Textarea id="comment" placeholder="Write your comment here..." rows={4} />
              <Button>Submit Comment</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 mt-8">
          {comments.map((comment) => {
            // Using mock data for comment author for now
            const commentAuthor = getUser(comment.authorId); 
            return (
              <div key={comment.id} className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={commentAuthor?.avatarUrl} alt={commentAuthor?.name} />
                  <AvatarFallback>{commentAuthor?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{commentAuthor?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-1 text-foreground/80">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
