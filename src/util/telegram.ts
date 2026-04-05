import TelegramBot from "node-telegram-bot-api";

export const createTelegramBot = async (token: string, webhookUrl: string) => {
  const bot = new TelegramBot(token, {
    webHook: {},
  });

  const webhookInfo = await bot.getWebHookInfo();
  const shouldRefreshWebhook =
    webhookInfo.url !== webhookUrl ||
    webhookInfo.pending_update_count > 0 ||
    Boolean(webhookInfo.last_error_message);

  if (shouldRefreshWebhook) {
    await (bot.deleteWebHook as (options: { drop_pending_updates: boolean }) => Promise<boolean>)({
      drop_pending_updates: true,
    });

    await bot.setWebHook(webhookUrl, {
      drop_pending_updates: true,
      max_connections: 100,
    } as TelegramBot.SetWebHookOptions & { drop_pending_updates: boolean });
  }

  return bot;
};
