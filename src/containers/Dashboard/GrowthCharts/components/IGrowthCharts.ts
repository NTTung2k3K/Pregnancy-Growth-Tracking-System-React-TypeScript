import { Child } from "../../Children/components/IChild";

export interface GrowthCharts {
  id: number;
  topic: string | null;
  question: string | null;
  status: string | null;
  viewCount: number | null;
  childModelView: Child;
  feedbackModelViews: any[];
}
