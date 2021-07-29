import { CONFIG_GROUP_STRUCTURE } from "./configurations";

// TYPES
const tmpCatArray: Array<string> = CONFIG_GROUP_STRUCTURE.reduce(
  (acc: Array<string>, group) => {
    return acc.concat(...group.categories);
  },
  [],
);
export type Category = typeof tmpCatArray[number];

export interface iTransaction {
  index: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
  groupName: string;
  monthIndex: number;
}

export interface iGroupConfig {
  name: string;
  type: "revenues" | "costs";
  categories: Array<Category>;
}
