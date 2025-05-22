
export interface BudgetItem {
  id: string;
  doc_id: string;
  item_no: number;
  description: string;
  category: string;
  color: string;
  faces: number;
  height_cm: number;
  width_cm: number;
  area_m2: number;
  area_m2_ceil: number;
  qty: number;
  unit_price: number;
  discount_pct: number;
  total_gs: number;
}

export interface BudgetItemCategory {
  value: string;
  label: string;
}
