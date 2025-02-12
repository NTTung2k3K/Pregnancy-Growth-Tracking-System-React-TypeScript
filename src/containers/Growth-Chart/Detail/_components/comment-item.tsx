
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { CommentForm } from "@/containers/Growth-Chart/Detail/_components/commnet-form";
import { formatDistanceToNow } from "date-fns";
interface User {
  id: string;
  email: string;
  fullName: string | null;
  image: string | null;
}

interface Feedback {
  id: number;
  description: string;
  rating: number;
  status: string;
  createdTime: string;
  feedbackType: string | null;
  user: User;
  responseFeedbacks: Feedback[];
}

interface CommentItemProps {
  feedback: Feedback;
  growthChartId: number;
  currentUserId: string | null; // Add currentUserId prop
  onReplySubmit: () => void;
  status: string;
}

export function CommentItem({
  feedback,
  growthChartId,
  currentUserId,
  onReplySubmit,
  status,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={feedback.user.image || undefined} />
          <AvatarFallback>
            {feedback.user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {feedback.user.fullName || feedback.user.email} &nbsp;{" "}
                {feedback.feedbackType ? (
                  <span
                    className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 
                   bg-clip-text text-transparent font-bold 
                   animate-pulse"
                  >
                    {feedback.feedbackType}
                  </span>
                ) : (
                  ""
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(feedback.createdTime), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {currentUserId && status != "Answered" && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-transparent flex items-center gap-2"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare className="w-4 h-4" />
                Reply
              </Button>
            )}
          </div>
          <p className="text-sm">{feedback.description}</p>
        </div>
      </div>

      {isReplying && (
        <div className="ml-14">
          <CommentForm
            status={status}
            growthChartId={growthChartId}
            userId={currentUserId}
            parentId={feedback.id}
            onSubmitSuccess={() => {
              setIsReplying(false);
              onReplySubmit();
            }}
          />
        </div>
      )}

      {feedback.responseFeedbacks.length > 0 && (
        <div className="ml-14 space-y-4">
          {feedback.responseFeedbacks.map((reply) => (
            <CommentItem
              status={status}
              key={reply.id}
              feedback={reply}
              growthChartId={growthChartId}
              currentUserId={currentUserId}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
