import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { API_ROUTES } from "@/routes/api";

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
  growthChartId: number | undefined;
  currentUserId: string;
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
  const role = localStorage.getItem("role");
  const apiLink =
    role === "Admin"
      ? BASE_URL + API_ROUTES.DASHBOARD_FEEDBACKS_ALL
      : BASE_URL + API_ROUTES.USER_FEEDBACK;

  useEffect(() => {
    fetchComments(1, true); // Load trang đầu tiên khi component mount
  }, []);

  const fetchComments = async (page: number, isRefresh = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiLink}?growthChartId=${growthChartId}&pageIndex=${page}&pageSize=10`
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
        <CardTitle className="flex items-center">
          Comments ({feedbacks.length})
          {status === "Answered" && (
            <>
              <p className="text-sky-400 ml-2">
                - The comments section will be closed as the question has been
                answered.
              </p>
            </>
          )}
        </CardTitle>
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
