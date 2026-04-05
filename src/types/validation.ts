import type { MessageSchemaValidation } from "../util/messages/base";

export type MessageValidationConstructor = new (message: string) => MessageSchemaValidation;
