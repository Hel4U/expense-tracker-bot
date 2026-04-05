export abstract class MessageSchemaValidation {
  protected cleanMessage: string;

  constructor(private message: string) {
    this.cleanMessage = message.trim();
  }

  public getCleanMessage(): string {
    return this.cleanMessage;
  }

  abstract checkMessage(): boolean;
}

export class MessageSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageSchemaError";
    this.message = `Invalid message format: ${message}`;
  }
}
