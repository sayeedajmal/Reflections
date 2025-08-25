
import Link from "next/link";
import { PlusCircle, Bot } from "lucide-react";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPostsByAuthor } from "./actions";
import { DeletePostButton } from "./delete-post-button";

// Helper function to safely parse JSON
const safeJsonParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};


export default async function DashboardPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const userCookie = cookieStore.get('user')?.value;

  const user = userCookie ? safeJsonParse(decodeURIComponent(userCookie)) : null;
  
  // Fetch posts only if we have a user and a token
  const posts = user && accessToken ? await getPostsByAuthor(user.id, accessToken) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage all articles on your blog.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/generate">
              <Bot className="mr-2 h-4 w-4" /> Generate Ideas
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-none border-x-0 sm:border-x sm:mx-6 lg:mx-8">
        <CardHeader className="px-4 sm:px-6 lg:px-8">
          <CardTitle>Your Articles</CardTitle>
          <CardDescription>
            A list of all your published and draft articles.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px] w-[40%] pl-4 sm:pl-6 lg:pl-8">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                  <TableHead className="pr-4 sm:pr-6 lg:pr-8 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts && posts.length > 0 ? (
                  posts.map((post: any) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium pl-4 sm:pl-6 lg:pl-8">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'PUBLISHED' ? 'default': 'secondary'}>{post.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-4 sm:pr-6 lg:pr-8 text-right">
                      <DeletePostButton postId={post.id} />
                    </TableCell>
                  </TableRow>
                ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No posts found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
