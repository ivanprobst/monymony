export type category = '' | 'Restaurants and bars' | 'Meal' | 'Transport' | 'Home';

export interface iTransaction {
  index: number,
  date: string,
  description: string,
  category: category,
  amount: number
}