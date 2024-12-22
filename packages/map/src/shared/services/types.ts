export type GoogleSheetsResponse = {
  majorDimension: "COLUMNS" | "ROWS";
  range: string; // "Sheet1!A1:Z1000"
  values: string[][];
};
