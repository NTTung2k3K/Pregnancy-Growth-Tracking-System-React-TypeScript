import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Ban, LockOpen, MessageSquare, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommentForm } from "./CommentForm";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { ROUTES } from "@/routes";
import toast from "react-hot-toast";
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
  growthChartId: number | undefined;
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
  const role = localStorage.getItem("role");

  const handleBan = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_FEEDBACKS_BAN}`,
        {
          id: feedback.id,
        },
        {
          headers: configHeaders(),
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_GROWTH_CHARTS_UPDATE.replace(
          ":id",
          String(growthChartId)
        )}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to ban feedback:", error);
    }
  };

  const handleUnban = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_FEEDBACKS_UNBAN}`,
        {
          id: feedback.id,
        },
        {
          headers: configHeaders(),
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_GROWTH_CHARTS_UPDATE.replace(
          ":id",
          String(growthChartId)
        )}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to unban feedback:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL + API_ROUTES.DASHBOARD_FEEDBACKS_DELETE}`,
        {
          params: {
            id: feedback.id,
          },
          headers: configHeaders(),
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_GROWTH_CHARTS_UPDATE.replace(
          ":id",
          String(growthChartId)
        )}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to ban feedback:", error);
    }
  };

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
                {feedback.status === "BANNED" ? (
                  <span className="text-red-500">Banned</span>
                ) : feedback.feedbackType ? (
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
            <div className="flex">
              {currentUserId && !["Answered", "BANNED"].includes(status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-slate-200 mr-2 flex items-center gap-2"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </Button>
              )}
              {role === "Admin" ? (
                feedback.status !== "BANNED" &&
                currentUserId &&
                status != "Answered" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2 bg-orange-400 text-white flex items-center gap-2"
                    onClick={() => handleBan()}
                  >
                    <Ban className="w-4 h-4" />
                    Ban
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2 bg-orange-400 text-white flex items-center gap-2"
                    onClick={() => handleUnban()}
                  >
                    <LockOpen className="w-4 h-4" />
                    Unban
                  </Button>
                )
              ) : (
                ""
              )}

              {role === "Admin" && currentUserId && status != "Answered" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-red-400 text-white flex items-center gap-2"
                  onClick={() => handleDelete()}
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
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
