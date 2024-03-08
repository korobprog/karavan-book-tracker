import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GoogleSheetsResponse } from "./types";

export const googleSheetKey = process.env.REACT_APP_GOOGLE_SHEET_KEY as string;
export const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const cellRange = ""; // use like: '!A1:D5'

// Define a service using a base URL and expected endpoints
export const googleApi = createApi({
  reducerPath: "sheetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sheets.googleapis.com/v4/spreadsheets/",
  }),
  endpoints: (builder) => ({
    getSheet: builder.query<GoogleSheetsResponse, string>({
      query: (sheetKey) =>
        `${sheetKey}/values/Sheet1${cellRange}?key=${apiKey}&majorDimension=ROWS`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSheetQuery } = googleApi;
