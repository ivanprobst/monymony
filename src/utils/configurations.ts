// Assets
import { iGroupConfig, Category } from "./types";

// CONFIGURATION MODELS
export const CONFIG_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const CONFIG_GROUP_STRUCTURE: Array<iGroupConfig> = [
  {
    name: "Revenues",
    type: "revenues",
    categories: ["Revenue 1", "Revenue 2", "Other revenue"],
  },
  {
    name: "Costs of living",
    type: "costs",
    categories: [
      "Home",
      "Health",
      "Meal",
      "Transport",
      "Interests",
      "Other living",
    ],
  },
  {
    name: "Costs of fun",
    type: "costs",
    categories: [
      "Restaurants and bars",
      "Media",
      "Gift",
      "Holiday",
      "Stuff",
      "Other fun",
    ],
  },
  {
    name: "Investments",
    type: "costs",
    categories: ["3a", "Home investments", "Other investments"],
  },
];

export const CONFIG_GROUP_LIST: Array<string> = CONFIG_GROUP_STRUCTURE.map(
  (group) => group.name,
);

export const CONFIG_CATEGORY_LIST: Array<Category> =
  CONFIG_GROUP_STRUCTURE.reduce((acc: Array<Category>, group) => {
    return acc.concat(...group.categories);
  }, []);

export const CONFIG_CATEGORY_TO_GROUP: { [cat: string]: string } =
  CONFIG_GROUP_STRUCTURE.reduce(
    (accumulator, group) => ({
      ...accumulator,
      ...group.categories.reduce(
        (accumulator2, category) => ({
          ...accumulator2,
          [category]: group.name,
        }),
        {},
      ),
    }),
    {},
  );

export const CONFIG_GROUP_TO_TYPE: { [groupName: string]: string } =
  CONFIG_GROUP_STRUCTURE.reduce(
    (acc, group) => ({ ...acc, [group.name]: group.type }),
    {},
  );

export const CONFIG_CHART_COLOR: {
  [group: string]: { [type: string]: string };
} = {
  Revenues: { colorClass: "green-500", colorCode: "#10B981" },
  "Costs of living": { colorClass: "mred", colorCode: "#AC3931" },
  "Costs of fun": { colorClass: "mred", colorCode: "#AC3931" },
  Investments: { colorClass: "mred", colorCode: "#AC3931" },
  Income: { colorClass: "mblue", colorCode: "#537D8D" },
};
