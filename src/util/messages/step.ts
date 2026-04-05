import { TELEGRAM_MESSAGE_VALIDATORS } from "@/config/constant";
import type { TelegramMsgHandlerStep } from "@/types/message";
import { tryCatch, tryCatchSync } from "../try-catch";
import { runTelegramMessageValidators } from "./engine";
import { parseMessage } from "./parsing";

export const validateStep: TelegramMsgHandlerStep = async (ctx, deps) => {
  deps.loggerInfo("Started doing message validation", { ctx });

  const [_, err] = tryCatchSync(() => runTelegramMessageValidators(ctx.messageText ?? ""));
  if (err) {
    await deps.sendMessage(
      ctx.chatId,
      "Please send a valid message in the format: `<amount> <description>` (e.g., `12.50 Lunch at cafe`).",
    );
    deps.logger(`Error validating message: ${err instanceof Error ? err.message : String(err)}`, {
      step: "validateStep",
    });
    return false;
  }

  ctx.messageText = new TELEGRAM_MESSAGE_VALIDATORS[0](ctx.messageText!).getCleanMessage();

  deps.loggerInfo("Message validation successful");
  return true;
};

export const parseStep: TelegramMsgHandlerStep = async (ctx, deps) => {
  deps.loggerInfo("Started parsing message", { ctx });

  const [parsed, err] = tryCatchSync(() => parseMessage(ctx.messageText!));

  if (err || !parsed) {
    await deps.sendMessage(
      ctx.chatId,
      "Please send a valid message in the format: `<amount> <description>` (e.g., `12.50 Lunch at cafe`).",
    );
    deps.logger(`Error parsing message: ${err instanceof Error ? err.message : String(err)}`, {
      step: "parseStep",
    });
    return false;
  }

  ctx.parsed = parsed!;

  deps.loggerInfo("Message parsing successful");
  return true;
};

export const syncToGoogleSheetStep: TelegramMsgHandlerStep = async (ctx, deps) => {
  deps.loggerInfo("Started syncing to Google Sheet ", { ctx });

  const [_, err] = await tryCatch(deps.syncMessage(ctx.parsed!, ctx.lastNumber + 1));

  if (err) {
    await deps.sendMessage(
      ctx.chatId,
      "Sorry, there was an error saving your expense. Please try again later.",
    );
    deps.logger(`Error syncing message: ${err instanceof Error ? err.message : String(err)}`, {
      step: "syncStep",
    });
    return false;
  }
  deps.loggerInfo("Successfully synced to Google Sheet");
  return true;
};

export const sendSuccessMessageStep: TelegramMsgHandlerStep = async (ctx, deps) => {
  deps.loggerInfo("Started sending success message", { ctx });

  const [_, err] = await tryCatch(deps.sendMessage(ctx.chatId, "Expense recorded successfully!"));

  if (err) {
    deps.logger(
      `Error sending success message: ${err instanceof Error ? err.message : String(err)}`,
      {
        step: "sendSuccessMessageStep",
      },
    );
    return false;
  }

  deps.loggerInfo("Success message sent");
  return true;
};
