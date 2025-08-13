
import Link from "next/link";
import { PlusCircle, MoreHorizontal, Bot } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/data";

export default function DashboardPage() {
  // In a real app, you'd fetch posts for the logged-in user
  const userPosts = getPosts();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Posts</h1>
          <p className="text-muted-foreground">
            Here you can manage all your blog posts.
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
                  <TableHead className="hidden md:table-cell">Published Date</TableHead>
                  <TableHead className="pr-4 sm:pr-6 lg:pr-8">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium pl-4 sm:pl-6 lg:pl-8">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Published</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-4 sm:pr-6 lg:pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                             <Link href={`/dashboard/edit/${post.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
