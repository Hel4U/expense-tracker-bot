import { type FastifyInstance } from "fastify";
import { telegramWebhookHandler } from "./telegram.controller";

export function telegramWebhookRoute(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {},
    },
    telegramWebhookHandler,
  );
}
