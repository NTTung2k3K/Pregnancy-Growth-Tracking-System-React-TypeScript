export interface Standard {
  id: number;
  week: number;
  gestationalAge: string;
  minWeight: number;
  maxWeight: number;
  averageWeight: number;
  minHeight: number;
  maxHeight: number;
  averageHeight: number;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number | null;
  gender: number | null;
}
