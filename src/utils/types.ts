// TYPES
export type category =
  | "Revenue Alice"
  | "Revenue Ivan"
  | "Other revenue"
  | "Home"
  | "Health"
  | "Meal"
  | "Transport"
  | "Interests"
  | "Other living"
  | "Restaurants and bars"
  | "Media"
  | "Gift"
  | "Holiday"
  | "Stuff"
  | "Other fun"
  | "3a"
  | "Home investments"
  | "Other investments";

export interface iTransaction {
  index: number;
  date: string;
  description: string;
  category: category;
  amount: number;
}

export interface iGridData {
  [category: string]: Array<number>;
}

export interface iGroupConfig {
  name: string;
  type: "revenues" | "costs";
  categories: Array<category>;
}
