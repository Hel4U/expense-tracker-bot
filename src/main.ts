import { HOST, PORT } from "@/config/env";
import { logger } from "@/util/logger";
import { buildServer } from "@/util/server";
import "dotenv/config";

async function main(): Promise<void> {
  const app = await buildServer();

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
