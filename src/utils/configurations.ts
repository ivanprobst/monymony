// Default configurations
export const MONTHS = [
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

export const GROUP_STRUCTURE: Array<{
  group: string;
  type: "costs" | "revenues";
  categories: Array<string>;
  colorTheme: { colorClass: string; colorCode: string }; // ??? Type shouldn't be manual, issues with MST types.array (IGroupConfiguration)
}> = [
  {
    group: "Revenues",
    type: "revenues",
    categories: ["Revenue 1", "Revenue 2", "Other revenue"],
    colorTheme: { colorClass: "green-500", colorCode: "#10B981" },
  },
  {
    group: "Costs of living",
    type: "costs",
    categories: [
      "Home",
      "Health",
      "Meal",
      "Transport",
      "Interests",
      "Other living",
    ],
    colorTheme: { colorClass: "mred", colorCode: "#AC3931" },
  },
  {
    group: "Costs of fun",
    type: "costs",
    categories: [
      "Restaurants and bars",
      "Media",
      "Gift",
      "Holiday",
      "Stuff",
      "Other fun",
    ],
    colorTheme: { colorClass: "mred", colorCode: "#AC3931" },
  },
  {
    group: "Investments",
    type: "costs",
    categories: ["3a", "Home investments", "Other investments"],
    colorTheme: { colorClass: "mred", colorCode: "#AC3931" },
  },
];
