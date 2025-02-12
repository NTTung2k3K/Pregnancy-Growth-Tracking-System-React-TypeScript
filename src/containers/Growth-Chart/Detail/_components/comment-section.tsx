

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CommentItem } from "./comment-item";
import { CommentForm } from "@/containers/Growth-Chart/Detail/_components/commnet-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";

interface Feedback {
  id: number;
  description: string;
  rating: number;
  status: string;
  createdTime: string;
  feedbackType: string | null;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    image: string | null;
  };
  responseFeedbacks: Feedback[];
}

interface CommentsProps {
  growthChartId: number;
  currentUserId: string | null;
  status: string;
}

export function CommentsSection({
  growthChartId,
  currentUserId,
  status,
}: CommentsProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments(1, true); // Load trang đầu tiên khi component mount
  }, []);

  const fetchComments = async (page: number, isRefresh = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/feedback/get-feedback-pagination?growthChartId=${growthChartId}&pageIndex=${page}&pageSize=10`
      );

      if (response.data.isSuccessed) {
        setFeedbacks((prevFeedbacks) =>
          isRefresh
            ? response.data.resultObj.feedbacks
            : [...prevFeedbacks, ...response.data.resultObj.feedbacks]
        );
        setHasMore(response.data.resultObj.hasMore);
        setPageIndex(page + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshComments = () => fetchComments(1, true);
  const loadMore = () => fetchComments(pageIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({feedbacks.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CommentForm
          status={status}
          growthChartId={growthChartId}
          userId={currentUserId}
          onSubmitSuccess={refreshComments}
        />

        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <CommentItem
              status={status}
              key={feedback.id}
              feedback={feedback}
              growthChartId={growthChartId}
              currentUserId={currentUserId}
              onReplySubmit={refreshComments}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={isLoading}
              className="w-full max-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Comments"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
