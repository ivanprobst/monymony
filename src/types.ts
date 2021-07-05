// TYPES
export type category =
  | ""
  | 'Revenue Alice'
  | 'Revenue Ivan'
  | 'Other revenue'
  | 'Interests'
  | 'Depreciation'
  | 'Home'
  | 'Health'
  | 'Meal'
  | 'Transport'
  | 'Other living'
  | 'Restaurants and bars'
  | 'Media'
  | 'Gift'
  | 'Holiday'
  | 'Stuff'
  | 'Other fun';

export interface iTransaction {
  index: number;
  date: string;
  description: string;
  category: category;
  amount: number;
}

export interface iGridRowModel {
  [group: string]: {
    [category: string]: Array<number>
  }
}

export interface iGridData {
  [category: string]: Array<number>
}

// CONFIGURATION MODELS
export const monthModel = [1,2,3,4,5,6,7,8,9,10,11,12];

export const gridRowModel: iGridRowModel = {
  'Revenues': {
    'Revenue Alice': [],
    'Revenue Ivan': [],
    'Other revenue': []
  },
  'Costs of living': {
    'Interests': [],
    'Depreciation': [],
    'Home': [],
    'Health': [],
    'Meal': [],
    'Transport': [],
    'Other living': []
  },
  'Costs of fun': {
    'Restaurants and bars': [],
    'Media': [],
    'Gift': [],
    'Holiday': [],
    'Stuff': [],
    'Other fun': []
  }
}