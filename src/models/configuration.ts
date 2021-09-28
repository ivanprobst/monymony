// Libs
import { types, Instance } from "mobx-state-tree";

// MODEL
const GroupConfiguration = types.model("GroupConfiguration", {
  group: types.string,
  type: types.union(types.literal("costs"), types.literal("revenues")),
  categories: types.array(types.string),
  colorTheme: types.model({
    colorClass: types.string,
    colorCode: types.string,
  }),
});
export interface IGroupConfiguration
  extends Instance<typeof GroupConfiguration> {}

// MODEL
export const ConfigurationStore = types
  .model("ConfigurationStore", {
    groupConfigurations: types.optional(types.array(GroupConfiguration), [
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
    ]),
    monthConfigurations: types.optional(types.array(types.string), [
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
    ]),
    isLoadingData: false,
  })
  .views((self) => ({
    get monthsList() {
      return self.monthConfigurations;
    },
    get numberOfMonths() {
      return self.monthConfigurations.length;
    },
    get groupsList() {
      return self.groupConfigurations.map(
        (groupConfiguration) => groupConfiguration.group,
      );
    },
    get categoriesList() {
      return self.groupConfigurations.flatMap(
        (groupConfiguration) => groupConfiguration.categories,
      );
    },
    categoriesFromGroup(group: string) {
      return self.groupConfigurations.find(
        (groupConfiguration) => group === groupConfiguration.group,
      )?.categories;
    },
    colorThemeFromGroup(group: string) {
      return self.groupConfigurations.find(
        (groupConfiguration) => group === groupConfiguration.group,
      )?.colorTheme;
    },
  }))
  .actions((self) => ({
    toggleIsLoadingData() {
      self.isLoadingData = !self.isLoadingData;
    },
  }));
export interface IConfigurationStore
  extends Instance<typeof ConfigurationStore> {}
