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
}
