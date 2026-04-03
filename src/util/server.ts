import { TELEGRAM_BOT_TOKEN, WEBHOOK_URL } from "@/config/env";
import { telegramWebhookRoute } from "@/modules/webhook/telegram/telegram.routes";
import Fastify from "fastify";
import type TelegramBot from "node-telegram-bot-api";
import { createTelegramBot } from "./telegram";

declare module "fastify" {
  interface FastifyInstance {
    bot: TelegramBot;
  }

  interface FastifyRequest {
    bot: TelegramBot;
  }
}

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

  app.decorate("bot", bot);
  app.decorateRequest("bot");

  app.addHook("onRequest", (request, _reply, done) => {
    request.bot = bot;
    done();
  });

  const healthCheckHandler = () => ({ status: "ok" });

  app.get("/", healthCheckHandler);
  app.get("/health", healthCheckHandler);

  app.register(telegramWebhookRoute, { prefix: "/webhook/telegram" });

  return app;
}
