import type { FastifyReply, FastifyRequest } from "fastify";
import type { TelegramRequestBody } from "./telegram.schema";

type TelegramWebhookRequest = FastifyRequest<{
  Body: TelegramRequestBody;
}>;

export function telegramWebhookHandler(request: TelegramWebhookRequest, reply: FastifyReply): void {
  request.log.info(
    {
      updateId: request.body?.update_id,
      messageText: request.body?.message?.text,
      chatId: request.body?.message?.chat?.id,
    },
    "Telegram webhook update received",
  );
  request.bot.processUpdate(request.body);
  request.log.info(
    { updateId: request.body?.update_id },
    "Telegram webhook update dispatched to bot",
  );
  void reply.status(200).send();
}
