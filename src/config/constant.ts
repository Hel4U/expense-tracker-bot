const GOOGLE_SHEETS_SCOPES = new Set<string>(["https://www.googleapis.com/auth/spreadsheets"]);

export function getGoogleSheetsScopes() {
  return Array.from(GOOGLE_SHEETS_SCOPES);
}
