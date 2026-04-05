import type { GoogleApiError } from "../types/google";

export function createGoogleSheetsError(
  error: unknown,
  action: string,
  spreadsheetId: string,
  range: string,
): Error {
  const googleApiError = error as GoogleApiError;
  const status = googleApiError.code ?? googleApiError.status;
  const apiMessage = googleApiError.response?.data?.error?.message ?? googleApiError.message;

  if (status === 401) {
    return new Error(
      `Google Sheets authentication failed while trying to ${action} ${spreadsheetId}:${range}. ` +
        `Check that the service-account key credentials are valid, ` +
        `the OAuth scopes are correct, and the key has not been revoked. Google API message: ${apiMessage}`,
    );
  }

  if (status === 403) {
    return new Error(
      `Google Sheets access was denied while trying to ${action} ${spreadsheetId}:${range}. ` +
        `Share the spreadsheet with the service-account email. ` +
        `Google API message: ${apiMessage}`,
    );
  }

  if (error instanceof Error) {
    return new Error(
      `Google Sheets request failed while trying to ${action} ${spreadsheetId}:${range}. ${error.message}`,
    );
  }

  return new Error(
    `Google Sheets request failed while trying to ${action} ${spreadsheetId}:${range}. ${String(error)}`,
  );
}
