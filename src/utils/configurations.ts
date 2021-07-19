// Assets
import { iGroupConfig } from "./types";

// CONFIGURATION MODELS
export const configMonths = ["Jan", "Feb", "Mar", "Apr", "May"];

export const configGroups: Array<iGroupConfig> = [
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

export const CONFIG_GROUP_LIST = configGroups.map((group) => group.name);
export const CONFIG_CATEGORY_TO_GROUP: { [cat: string]: string } =
  configGroups.reduce(
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

export const CONFIG_CHART_COLOR: {
  [group: string]: { [type: string]: string };
} = {
  Revenues: { class: "revenues-color", colorCode: "#E5D352" },
  "Costs of living": { class: "costs-color", colorCode: "#AC3931" },
  "Costs of fun": { class: "costs-color", colorCode: "#AC3931" },
  Investments: { class: "costs-color", colorCode: "#AC3931" },
  Income: { class: "income-color", colorCode: "#537D8D" },
};
