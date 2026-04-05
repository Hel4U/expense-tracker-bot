import type { Deps, TelegramStepContext } from "@/types/message";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { TelegramRequestBody } from "./telegram.schema";
import { processTelegramExpenses, syncToSheet } from "./telegram.services";

type TelegramWebhookRequest = FastifyRequest<{
  Body: TelegramRequestBody;
}>;

export async function telegramWebhookHandler(
  request: TelegramWebhookRequest,
  reply: FastifyReply,
): Promise<void> {
  const updateId = request.body?.update_id;
  const messageText = request.body?.message?.text;
  const chatId = request.body?.message?.chat?.id;
  const lastNumber = request.lastSeqNumber;

  const ctx: TelegramStepContext = {
    chatId: chatId!,
    updateId: updateId,
    messageText,
    lastNumber,
  };

  const deps: Deps = {
    sendMessage: async (chatId: number, text: string) =>
      await request.bot.sendMessage(chatId, text),
    syncMessage: syncToSheet,
    loggerInfo: (msg: string, meta?: unknown) => {
      if (meta) {
        request.log.info(meta, msg);
      } else {
        request.log.info(msg);
      }
    },
    logger: (errMsg?: string, meta?: unknown) => {
      if (meta) {
        request.log.error(meta, errMsg || "Error");
      } else {
        request.log.error(errMsg || "Error");
      }
    },
  };

  await processTelegramExpenses(ctx, deps);

  request.lastSeqNumber += 1;
  void reply.status(200).send();
}
