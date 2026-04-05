import type { MessageValidationConstructor } from "@/types/validation";
import {
  CommandUsedValidation,
  EmptyMessageValidation,
  MessageContainOnlyNumberAtStartOneTimeValidation,
  NoFirstLineCharactersValidation,
  NoMultipleSpacesValidation,
  NoNegativeNumbersValidation,
  NoNewlinesValidation,
  NoTabsValidation,
  NotFirstLineZeroValidation,
  ShouldContainCharactersAfterFirstLineValidation,
} from "@/util/messages/validators";

const GOOGLE_SHEETS_SCOPES = new Set<string>(["https://www.googleapis.com/auth/spreadsheets"]);

export function getGoogleSheetsScopes() {
  return Array.from(GOOGLE_SHEETS_SCOPES);
}

export const FOOD = "food";
export const TRANSPORT = "transport";
export const ENTERTAINMENT = "entertainment";
export const OTHER = "other";
export const BILLS = "bills";
export const HEALTH = "health";
export const LIFESTYLE = "lifestyle";

export const CATEGORIES = {
  [FOOD]: "Food",
  [TRANSPORT]: "Transport",
  [ENTERTAINMENT]: "Entertainment",
  [OTHER]: "Other",
  [BILLS]: "Bills",
  [HEALTH]: "Health",
  [LIFESTYLE]: "Lifestyle",
} as const;

export const TELEGRAM_MESSAGE_VALIDATORS = [
  EmptyMessageValidation,
  CommandUsedValidation,
  NoTabsValidation,
  NoNewlinesValidation,
  NoMultipleSpacesValidation,
  NoNegativeNumbersValidation,
  NoFirstLineCharactersValidation,
  NotFirstLineZeroValidation,
  ShouldContainCharactersAfterFirstLineValidation,
  MessageContainOnlyNumberAtStartOneTimeValidation,
] as const satisfies readonly MessageValidationConstructor[];

export const SHEET_NAME = "Expenses";
export const SHEET_SERIAL_NAME = "A";
export const SHEET_AMOUNT_NAME = "D";
export const SHEET_DATE_NAME = "B";
export const SHEET_DESCRIPTION_NAME = "C";
export const SHEET_CATEGORY_NAME = "E";
