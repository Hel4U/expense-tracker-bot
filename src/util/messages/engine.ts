import { TELEGRAM_MESSAGE_VALIDATORS } from "../../config/constant";
import type { Deps, TelegramMsgHandlerStep, TelegramStepContext } from "../../types/message";

export function runTelegramMessageValidators(message: string): void {
  for (const Validation of TELEGRAM_MESSAGE_VALIDATORS) {
    new Validation(message).checkMessage();
  }
}

export async function runMessageProcessingPipeline(
  ctx: TelegramStepContext,
  deps: Deps,
  steps: TelegramMsgHandlerStep[],
): Promise<void> {
  for (const step of steps) {
    const shouldContinue = await step(ctx, deps);

    if (!shouldContinue) {
      break;
    }
  }
}
