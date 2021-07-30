// Assets
import { iGroupConfig } from "./types";

// CONFIGURATION MODELS
export const CONFIG_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May"];

export const CONFIG_GROUP_STRUCTURE: Array<iGroupConfig> = [
  {
    name: "Revenues",
    type: "revenues",
    categories: ["Revenue Alice", "Revenue Ivan", "Other revenue"],
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

export const CONFIG_GROUP_LIST = CONFIG_GROUP_STRUCTURE.map(
  (group) => group.name,
);
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
  Revenues: { colorClass: "myellow", colorCode: "#E5D352" },
  "Costs of living": { colorClass: "mred", colorCode: "#AC3931" },
  "Costs of fun": { colorClass: "mred", colorCode: "#AC3931" },
  Investments: { colorClass: "mred", colorCode: "#AC3931" },
  Income: { colorClass: "mblue", colorCode: "#537D8D" },
};
