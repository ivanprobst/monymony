import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
	overrides: {
		MuiTableCell: {
			head: {
				fontWeight: "bold",
			},
		},
	},
});
