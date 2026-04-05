import { SHEET_AMOUNT_NAME, SHEET_NAME, SHEET_SERIAL_NAME } from "@/config/constant";
import { SPREADSHEET_ID } from "@/config/env";
import type { Deps, ParsedMessage, TelegramStepContext } from "@/types/message";
import { appendSheetValues } from "@/util/google";
import { runMessageProcessingPipeline } from "@/util/messages/engine";
import {
  parseStep,
  sendSuccessMessageStep,
  syncToGoogleSheetStep,
  validateStep,
} from "@/util/messages/step";

export async function processTelegramExpenses(ctx: TelegramStepContext, deps: Deps): Promise<void> {
  await runMessageProcessingPipeline(ctx, deps, [
    validateStep,
    parseStep,
    syncToGoogleSheetStep,
    sendSuccessMessageStep,
  ]);
}

export async function syncToSheet(
  parsed: ParsedMessage | null,
  seqNumber: number,
): Promise<void | null> {
  if (parsed === null) {
    throw new Error("Cannot sync empty message");
  }

  await appendSheetValues({
    spreadsheetId: SPREADSHEET_ID,
    values: [[seqNumber, parsed.date, parsed.description, parsed.amount]],
    range: `'${SHEET_NAME}'!${SHEET_SERIAL_NAME}:${SHEET_AMOUNT_NAME}`,
  });
}
