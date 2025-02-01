export interface Child {
  id: number;
  userId: string;
  name: string;
  fetalGender: string | null;
  pregnancyStage: string | null;
  weightEstimate: number | null;
  heightEstimate: number | null;
  dueDate: string | null;
  deliveryPlan: string | null;
  complications: string | null;
  photoUrl: string | null;
  bloodType: string | null;
  pregnancyWeekAtBirth: number | null;
  isGenerateSampleAppointments: boolean;
  fetalGrowthRecordModelViews: FetalGrowthRecord[];
}

export type FetalGrowthRecord = {
  recordedAt: string;
  weekOfPregnancy: number;
  weight: number;
  height: number;
  healthCondition: string | null;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number;
  fetalGrowthStandardModelView: {
    averageHeight: number;
    averageWeight: number;
    fetalHeartRate: number;
    minHeight: number;
    maxHeight: number;
    minWeight: number;
    maxWeight: number;
    gestationalAge: string;
    headCircumference: number;
    abdominalCircumference: number;
  };
};
