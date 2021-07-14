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

// CONFIGURATION MODELS
export const configMonths = ["January", "February", "March", "April", "May"];

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
