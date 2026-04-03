import { getGoogleSheetsScopes } from "@/config/constant";
import { GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_MAIL } from "@/config/env";
import type {
  AppendSheetValuesParams,
  ReadSheetValuesParams,
  UpdateSheetValuesParams,
} from "@/types/google";
import { google, type sheets_v4 } from "googleapis";
import { createGoogleSheetsError } from "./error";
import { tryCatch } from "./try-catch";

let _sheet: sheets_v4.Sheets | null = null;

// Create GoogleAuth (singleton)
function getSheet() {
  if (!_sheet) {
    const googleAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_MAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: getGoogleSheetsScopes(),
    });

    _sheet = google.sheets({ version: "v4", auth: googleAuth });
  }

  return _sheet;
}

export async function readSheetValues({
  spreadsheetId,
  range,
  majorDimension = "ROWS",
  valueRenderOption = "FORMATTED_VALUE",
}: ReadSheetValuesParams): Promise<sheets_v4.Schema$ValueRange> {
  const sheets = getSheet();

  const [response, error] = await tryCatch(
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      majorDimension,
      valueRenderOption,
    }),
  );

  if (error) {
    throw createGoogleSheetsError(error, "read", spreadsheetId, range);
  }

  return response.data;
}

export async function appendSheetValues({
  spreadsheetId,
  range,
  values,
  valueInputOption = "USER_ENTERED",
  insertDataOption = "INSERT_ROWS",
}: AppendSheetValuesParams): Promise<sheets_v4.Schema$AppendValuesResponse> {
  const sheets = getSheet();

  const [response, error] = await tryCatch(
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      insertDataOption,
      requestBody: {
        values,
      },
    }),
  );

  if (error) {
    throw createGoogleSheetsError(error, "append to", spreadsheetId, range);
  }

  return response.data;
}

export async function updateSheetValues({
  spreadsheetId,
  range,
  values,
  valueInputOption = "USER_ENTERED",
}: UpdateSheetValuesParams): Promise<sheets_v4.Schema$UpdateValuesResponse> {
  const sheets = getSheet();

  const [response, error] = await tryCatch(
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody: {
        values,
      },
    }),
  );

  if (error) {
    throw createGoogleSheetsError(error, "update", spreadsheetId, range);
  }

  return response.data;
}
