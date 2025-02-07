import { Child } from "../../Children/components/IChild";
import { User } from "../../Users/components/IUser";

export interface GrowthChart {
  id: number;
  topic: string | null;
  question: string | null;
  status: string | null;
  viewCount: number | null;
  childModelView: Child;
  feedbackModelViews: any[];
  userViewModel: User,
}
