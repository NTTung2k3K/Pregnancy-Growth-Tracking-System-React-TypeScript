/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface GrowthChartCardProps {
  chart: {
    id: number;
    status: string;
    topic: string;
    question: string;
    viewCount: number;
    createdTime: string;
    userViewModel: {
      id: string;
      email: string;
      fullName: string;
      image: string;
      dateOfBirth: any;
      address: any;
      phoneNumber: any;
      gender: any;
      bloodGroup: any;
      status: string;
      createdBy: any;
      isEmailConfirmed: any;
      lastUpdatedBy: any;
      childs: any;
    };
    childModelView: {
      name: string;
      photoUrl: string;
      dueDate: string;
    };
  };
}

export function GrowthChartCard({ chart }: GrowthChartCardProps) {
  return (
    <Link to={`/growth-chart/${chart.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={chart.userViewModel.image}
              alt={chart.userViewModel.fullName}
            />
            <AvatarFallback>
              {chart.userViewModel.fullName[0] || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{chart.topic}</CardTitle>
              <div className="">
                <Badge
                  variant={
                    chart.status === "Answered" ? "outline" : "secondary"
                  }
                >
                  {chart.status}
                </Badge>
                <span className="text-sm">
                  {formatDistanceToNow(new Date(chart.createdTime), {
                    addSuffix: true,
                  })}{" "}
                </span>
                <br />
                <span className="text-xs">
                  Posted by <strong> {chart.userViewModel.fullName}</strong>
                </span>{" "}
                <br></br>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{chart.childModelView.name}</span>
              <span>•</span>
              <span>
                {new Date(chart.childModelView.dueDate).toLocaleDateString(
                  "vi-VN"
                )}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{chart.question}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Eye className="w-4 h-4 mr-1" />
            {chart.viewCount} views
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
