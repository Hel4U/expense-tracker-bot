import type { sheets_v4 } from "googleapis";

export type SheetValues = NonNullable<sheets_v4.Schema$ValueRange["values"]>;

export type ReadSheetValuesParams = {
  spreadsheetId: string;
  range: string;
  majorDimension?: "ROWS" | "COLUMNS";
  valueRenderOption?: "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA";
};

export type AppendSheetValuesParams = {
  spreadsheetId: string;
  range: string;
  values: SheetValues;
  valueInputOption?: "RAW" | "USER_ENTERED";
  insertDataOption?: "OVERWRITE" | "INSERT_ROWS";
};

export type UpdateSheetValuesParams = {
  spreadsheetId: string;
  range: string;
  values: SheetValues;
  valueInputOption?: "RAW" | "USER_ENTERED";
};

export type GoogleApiError = Error & {
  code?: number;
  status?: number;
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
};
