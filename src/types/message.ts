import type TelegramBot from "node-telegram-bot-api";

export type ParsedMessage = {
  amount: number;
  description: string;
  text: string;
  date: string;
};

type StepContext = {
  messageText?: string | undefined;
  parsed?: ParsedMessage;
  lastNumber: number;
};

export type TelegramStepContext = {
  chatId: number;
  updateId: number;
} & StepContext;

export type Deps = {
  sendMessage: (chatId: number, text: string) => Promise<TelegramBot.Message>;
  syncMessage: (data: ParsedMessage | null, seqNumber: number) => Promise<void | null>;
  logger: (errMsg?: string, meta?: unknown) => void;
  loggerInfo: (infoMsg: string, meta?: unknown) => void;
};

export type TelegramMsgHandlerStep = (
  ctx: TelegramStepContext,
  deps: Deps,
) => Promise<boolean> | boolean;
