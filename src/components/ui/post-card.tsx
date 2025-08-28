import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  className?: string;
}

export function PostCard({
  id,
  title,
  excerpt,
  featuredImage,
  author,
  publishedAt,
  status = "PUBLISHED",
  className = "",
}: PostCardProps) {
  return (
    <Card className={`glass-card hover-lift hover-glow transition-smooth group overflow-hidden ${className}`}>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={featuredImage}
          alt={title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />
      </div>
      
      <CardHeader className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground font-medium">
              {author.name}
            </span>
          </div>
          {status === "DRAFT" && (
            <Badge variant="secondary" className="text-xs">
              Draft
            </Badge>
          )}
        </div>
        
        <h3 className="font-heading text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-smooth">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {publishedAt}
        </div>
      </CardContent>
    </Card>
  );
}