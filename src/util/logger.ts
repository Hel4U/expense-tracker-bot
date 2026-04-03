import pino, { type Logger } from "pino";

export const logger: Logger = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
  },
});
