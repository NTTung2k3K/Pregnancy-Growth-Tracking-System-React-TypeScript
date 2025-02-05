/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrowthCharts } from "@/containers/Dashboard/Appointment/components/chart-record";
import { CommentsSection } from "@/containers/Growth-Chart/Detail/_components/comment-section";
import { CookiesService } from "@/services/cookies.service";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";

export interface GrowthChartDetailUI {
  id: number;
  status: string;
  topic: string;
  question: string;
  viewCount: number;
  createdTime: string;
  userViewModel: UserViewModel;
  childModelView: ChildModelView;
  feedbackModelViews: FeedbackModelView[];
}

export interface UserViewModel {
  id: string;
  email: string;
  fullName: string;
  image: string;
  dateOfBirth: string | null;
  address: string | null;
  phoneNumber: string | null;
  gender: string | null;
  bloodGroup: string | null;
  status: string;
}
export interface ChildModelView {
  fetalGrowthRecordModelViews: FetalGrowthRecordModelView[];
  id: number;
  userId: string;
  name: string;
  fetalGender: string;
  pregnancyStage: string;
  weightEstimate: number;
  heightEstimate: number;
  dueDate: string;
  deliveryPlan: string;
  complications: string;
  photoUrl: string;
  bloodType: string;
  pregnancyWeekAtBirth: string;
}

export interface FetalGrowthRecordModelView {
  fetalGrowthStandardModelView: FetalGrowthStandardModelView;
  id: number;
  childId: number;
  weekOfPregnancy: number;
  weight: number;
  height: number;
  recordedAt: string;
  healthCondition: string;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number;
}

export interface FetalGrowthStandardModelView {
  id: number;
  gestationalAge: string;
  minWeight: number;
  maxWeight: number;
  averageWeight: number;
  minHeight: number;
  maxHeight: number;
  averageHeight: number;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number;
}

export interface FeedbackModelView {
  id: number;
  description: string;
  rating: number;
  feedbackType: string;
  status: string;
  createdTime: string;
  user: User;
  responseFeedbacks: ResponseFeedback[];
}

export interface User {
  id: string;
  email: string;
  fullName: any;
  image: any;
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
}

export interface ResponseFeedback {
  id: number;
  description: string;
  rating: number;
  feedbackType: any;
  status: string;
  createdTime: string;
  user: User2;
  responseFeedbacks: any[];
}

export interface User2 {
  id: string;
  email: string;
  fullName: any;
  image: any;
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
}

export default function GrowthChartDetailUI(props: {
  data: GrowthChartDetailUI;
}) {
  const { data } = props;
  const child = data.childModelView;
  //   const records = child.fetalGrowthRecordModelViews;
  const currentUserId = CookiesService.get();
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={data.userViewModel.image}
                alt={data.userViewModel.fullName}
              />
              <AvatarFallback>
                {data.userViewModel.fullName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{data.topic}</CardTitle>
            <p className="text-muted-foreground">{data.question}</p>
            <p className="text-sm text-muted-foreground">
              Posted by {data.userViewModel.fullName} •{" "}
              {formatDistanceToNow(new Date(data.createdTime), {
                addSuffix: true,
              })}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{data.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Child Name</p>
              <p className="font-medium">{child.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {new Date(child.dueDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="font-medium">{data.viewCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="growth">
        <TabsList>
          <TabsTrigger value="growth">Growth Charts</TabsTrigger>
          <TabsTrigger value="details">Child Details</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <GrowthCharts key={child.id} child={child} />
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardContent className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 pb-4 mb-4 border-b">
                  <h3 className="font-semibold mb-2">Parent Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-16 h-16 mb-3">
                      <p className="text-sm text-muted-foreground">Avatar</p>
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={child.photoUrl} alt={child.name} />
                        <AvatarFallback>{child.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {data.userViewModel.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{data.userViewModel.email}</p>
                    </div>
                    {data.userViewModel.phoneNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">
                          {data.userViewModel.phoneNumber}
                        </p>
                      </div>
                    )}
                    {data.userViewModel.bloodGroup && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Blood Group
                        </p>
                        <p className="font-medium">
                          {data.userViewModel.bloodGroup}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">
                    {child.fetalGender === "1" ? "Male" : "Female"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{child.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pregnancy Stage
                  </p>
                  <p className="font-medium">{child.pregnancyStage}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pregnancy Week at Birth
                  </p>
                  <p className="font-medium">{child.pregnancyWeekAtBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Weight Estimate
                  </p>
                  <p className="font-medium">{child.weightEstimate} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Height Estimate
                  </p>
                  <p className="font-medium">{child.heightEstimate} cm</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Delivery Plan</p>
                  <p className="font-medium">{child.deliveryPlan}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Complications</p>
                  <p className="font-medium">{child.complications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Separator className="my-6" />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Discussion</h2>
        <p className="text-muted-foreground">
          Share your thoughts and experiences about this growth chart
        </p>
      </div>
      <CommentsSection
        growthChartId={data.id}
        currentUserId={currentUserId}
        status={data.status}
      />
    </div>
  );
}
