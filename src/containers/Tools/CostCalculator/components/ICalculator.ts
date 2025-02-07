export interface CostItem {
  name: string;
  amount: number;
  months?: number;
  enabled?: boolean;
}

export interface OngoingCosts {
  childcare: {
    regularCare: CostItem;
    babysitter: CostItem;
  };
  diapering: {
    diapers: CostItem;
    wipes: CostItem;
  };
  feeding: {
    formula: CostItem;
    solidFood: CostItem;
  };
  items: {
    clothing: CostItem;
    toys: CostItem;
  };
}

export interface OneTimeCosts {
  gear: Record<string, CostItem>;
  activityEquipment: Record<string, CostItem>;
  nursery: Record<string, CostItem>;
  feeding: Record<string, CostItem>;
  breastfeeding: Record<string, CostItem>;
  bathingGrooming: Record<string, CostItem>;
  healthSafety: Record<string, CostItem>;
}
