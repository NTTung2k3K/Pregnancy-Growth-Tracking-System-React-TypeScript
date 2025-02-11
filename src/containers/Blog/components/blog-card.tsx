import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    likesCount: number;
    viewCount: number;
    thumbnail: string;
    status: string;
    week: number;
    blogTypeModelView: {
      id: number;
      name: string;
    };
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link to={`/blog-detail/${blog.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardHeader className="flex flex-row items-center gap-4">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{blog.title}</CardTitle>
              <Badge variant={blog.status === "Published" ? "outline" : "secondary"}>
                {blog.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Week {blog.week}</span>
              <span>•</span>
              <span>{blog.blogTypeModelView.name}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <Heart className="w-4 h-4 mr-1" />
            {blog.likesCount}
            <span className="mx-2">•</span>
            <Eye className="w-4 h-4 mr-1" />
            {blog.viewCount}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}