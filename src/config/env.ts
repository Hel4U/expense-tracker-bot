import "dotenv/config";
import z from "zod";

const envParser = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("localhost"),
  WEBHOOK_URL: z.string().default(""),
  SPREADSHEET_ID: z.string(),
  GOOGLE_SERVICE_ACCOUNT_MAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
});

const env = envParser.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables:", env.error.format());
  process.exit(1);
}

export const {
  TELEGRAM_BOT_TOKEN,
  PORT,
  HOST,
  WEBHOOK_URL,
  GOOGLE_SERVICE_ACCOUNT_MAIL,
  GOOGLE_PRIVATE_KEY,
  SPREADSHEET_ID,
} = env.data;
