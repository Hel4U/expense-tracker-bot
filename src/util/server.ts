import Fastify from "fastify";

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: "debug",
      transport: {
        target: "pino-pretty",
      },
    },
  });

  app.get("/health", async (_, __) => {
    return { status: "ok" };
  });

  return app;
}
