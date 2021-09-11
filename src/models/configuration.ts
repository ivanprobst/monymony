// Libs
import * as React from "react";
import { types, Instance } from "mobx-state-tree";

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

// Models
export const GroupConfiguration = types.model("GroupConfiguration", {
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

export const ConfigurationStore = types
  .model("ConfigurationStore", {
    groupsConfigurations: types.array(GroupConfiguration),
    monthsConfiguration: types.array(types.string),
  })
  .views((self) => ({
    get monthsList() {
      return self.monthsConfiguration;
    },
    get numberOfMonths() {
      return self.monthsConfiguration.length;
    },
    get groupsList() {
      return self.groupsConfigurations.map(
        (groupConfiguration) => groupConfiguration.group,
      );
    },
    get categoriesList() {
      return self.groupsConfigurations.flatMap(
        (groupConfiguration) => groupConfiguration.categories,
      );
    },
    categoriesFromGroup(group: string) {
      return self.groupsConfigurations.find(
        (groupConfiguration) => group === groupConfiguration.group,
      )?.categories; // ??? Fix the potential undefined return
    },
    groupFromCategory(category: string) {
      return self.groupsConfigurations.find((groupConfiguration) =>
        groupConfiguration.categories.includes(category),
      )?.group; // ??? Fix the potential undefined return
    },
    typeFromCategory(category: string) {
      return self.groupsConfigurations.find((groupConfiguration) =>
        groupConfiguration.categories.includes(category),
      )?.type; // ??? Fix the potential undefined return
    },
    colorThemeFromGroup(group: string) {
      return self.groupsConfigurations.find(
        (groupConfiguration) => group === groupConfiguration.group,
      )?.colorTheme; // ??? Fix the potential undefined return
    },
  }))
  .actions((self) => ({
    addGroupConfiguration(groupConfiguration: IGroupConfiguration) {
      self.groupsConfigurations.push(groupConfiguration);
    },
    setMonthsConfiguration(monthsConfiguration: Array<string>) {
      self.monthsConfiguration.clear();
      monthsConfiguration.forEach((month) =>
        self.monthsConfiguration.push(month),
      ); // ??? Loop seems overkill, check how to directly assign
    },
  }));

// Context creation
const configurationStore = ConfigurationStore.create();
configurationStore.setMonthsConfiguration(MONTHS);
GROUP_STRUCTURE.forEach((groupConfiguration) => {
  configurationStore.addGroupConfiguration(
    GroupConfiguration.create(groupConfiguration),
  );
});
export const ConfigurationContext = React.createContext(configurationStore);
