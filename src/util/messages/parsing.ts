import type { ParsedMessage } from "@/types/message";

export function parseMessage(message: string): ParsedMessage {
  const splittedMessage = message.split(" ");
  const amountText = splittedMessage[0]!;
  const description = splittedMessage.slice(1).join(" ") || "No description";

  return {
    amount: Number.parseInt(amountText, 10),
    description,
    text: message,
    date: new Date().toISOString().split("T")[0]!,
  };
}
