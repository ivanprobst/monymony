# Mony mony

Track your household financials like a company: budget, invest and ensure you are profitable.

Current features:

- Loads your financials transactions from a GSheet source
- Visualize your financials data:
  - Grid view: financials presented like a P&L statement
  - Chart view: including trend lines

## Demo

Check out the demo at [monymony.ivanprobst.com](monymony.ivanprobst.com) ([raw data available here](https://docs.google.com/spreadsheets/d/1IZl_O6hXXfc03Suu3_lA2J5h4g29GqjaNHok0ST31yM/edit#gid=0))

## Deploy on your own

1. Fork this repo
2. Install dependencies
3. Add env vars: `process.env.REACT_APP_GSHEET_URL` and `process.env.REACT_APP_GAPI_KEY`
4. Start the app (`npm start`)

Your GSheet transactions columns should be:

- Col 1: index (unique ID)
- Col 2: date (dd.mm.yyyy)
- Col 3: description
- Col 4: category (matching configuration CONFIG_GROUP_STRUCTURE)
- Col 5: amount
