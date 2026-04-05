import { HOST, PORT } from "./config/env";
import Fastify from "fastify";
import { logger } from "./util/logger";
import { configureServer } from "./util/server";
import "dotenv/config";

async function main(): Promise<void> {
  const app = Fastify({
    logger: {
      level: "debug",
      transport: {
        target: "pino-pretty",
      },
    },
  });

  await configureServer(app);

  await app.listen({
    port: PORT,
    host: HOST,
  });
}

main().catch((e) => {
  if (e instanceof Error) {
    logger.debug("Error starting server: %o", e);
  } else {
    logger.debug("Error starting server: %s", String(e));
  }
});
