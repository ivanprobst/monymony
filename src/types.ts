// TYPES
export type category =
	| ""
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

export interface iGridRowModel {
	[group: string]: {
		[category: string]: Array<number>;
	};
}

export interface iGridData {
	[category: string]: Array<number>;
}

// CONFIGURATION MODELS
export const configColumns = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const gridRowModel: iGridRowModel = {
	Revenues: {
		"Revenue Alice": [],
		"Revenue Ivan": [],
		"Other revenue": [],
	},
	"Costs of living": {
		Home: [],
		Health: [],
		Meal: [],
		Transport: [],
		Interests: [],
		"Other living": [],
	},
	"Costs of fun": {
		"Restaurants and bars": [],
		Media: [],
		Gift: [],
		Holiday: [],
		Stuff: [],
		"Other fun": [],
	},
	Investments: {
		"3a": [],
		"Home investments": [],
		"Other investments": [],
	},
};
