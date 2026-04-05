import { SHEET_NAME, SHEET_SERIAL_NAME } from "@/config/constant";
import { SPREADSHEET_ID, TELEGRAM_BOT_TOKEN, WEBHOOK_URL } from "@/config/env";
import { telegramWebhookRoute } from "@/modules/webhook/telegram/telegram.routes";
import Fastify from "fastify";
import type TelegramBot from "node-telegram-bot-api";
import { readSheetValues } from "./google";
import { createTelegramBot } from "./telegram";
import { tryCatch } from "./try-catch";

declare module "fastify" {
  interface FastifyInstance {
    bot: TelegramBot;
  }

  interface FastifyRequest {
    bot: TelegramBot;
    lastSeqNumber: number;
  }
}

let lastSeqNumber: number = 0;

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: "debug",
      transport: {
        target: "pino-pretty",
      },
    },
  });

  const bot = await createTelegramBot(TELEGRAM_BOT_TOKEN, WEBHOOK_URL);
  const [data, error] = await tryCatch(
    readSheetValues({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!${SHEET_SERIAL_NAME}2:${SHEET_SERIAL_NAME}`,
    }),
  );

  if (error) {
    app.log.error("Failed to read initial data from Google Sheets: %s", error.message);
  }

  lastSeqNumber = Number(data?.values?.length ?? 0);

  app.decorate("bot", bot);
  app.decorateRequest("bot");

  app.addHook("onRequest", (request, _reply, done) => {
    request.bot = bot;
    request.lastSeqNumber = lastSeqNumber;
    done();
  });

  const healthCheckHandler = () => ({ status: "ok" });

  app.get("/", healthCheckHandler);
  app.get("/health", healthCheckHandler);

  app.register(telegramWebhookRoute, { prefix: "/webhook/telegram" });

  return app;
}
