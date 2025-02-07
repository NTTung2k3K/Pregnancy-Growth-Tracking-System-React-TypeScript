import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import toast from "react-hot-toast";

interface CommentFormProps {
  growthChartId: number | undefined;
  userId: string | null; // Add userId prop
  parentId?: number;
  onSubmitSuccess: () => void;
  status: string;
}

export function CommentForm({
  growthChartId,
  userId,
  parentId,
  onSubmitSuccess,
  status,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const role = localStorage.getItem("role");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await axios.post(`${BASE_URL}/feedback/create`, {
        description: comment,
        growthChartsID: growthChartId,
        userId: userId,
        parentFeedbackID: parentId || null,
        feedbackType: role,
      });

      if (result.data.isSuccessed) {
        setComment("");
        onSubmitSuccess();
        toast.success("Comment posted successfully");
      } else {
        toast.error(result.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {status != "Answered" ? (
        <>
          {userId && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          )}
          {userId == null && <h3>Login to feedback this chart</h3>}
        </>
      ) : (
        ""
      )}
    </>
  );
}
