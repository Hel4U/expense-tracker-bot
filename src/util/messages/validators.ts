import { MessageSchemaError, MessageSchemaValidation } from "./base";

export class CommandUsedValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    if (this.cleanMessage.startsWith("/")) {
      throw new MessageSchemaError("Commands are not allowed in the message.");
    }
    return true;
  }
}

export class EmptyMessageValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    if (this.cleanMessage.length === 0) {
      throw new MessageSchemaError("Message cannot be empty.");
    }
    return true;
  }
}

export class NotFirstLineZeroValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const firstLine = this.cleanMessage.split(" ")[0] ?? "";
    if (firstLine === "0") {
      throw new MessageSchemaError("First line cannot be zero.");
    }
    return true;
  }
}

export class NoNegativeNumbersValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const negativeNumberPattern = /-\d+/;
    if (negativeNumberPattern.test(this.cleanMessage)) {
      throw new MessageSchemaError("Negative numbers are not allowed in the message.");
    }
    return true;
  }
}

export class NoMultipleSpacesValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const multipleSpacesPattern = / {2,}/;
    if (multipleSpacesPattern.test(this.cleanMessage)) {
      throw new MessageSchemaError("Multiple consecutive spaces are not allowed in the message.");
    }
    return true;
  }
}

export class NoTabsValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const tabPattern = /\t/;
    if (tabPattern.test(this.cleanMessage)) {
      throw new MessageSchemaError("Tabs are not allowed in the message.");
    }
    return true;
  }
}

export class NoNewlinesValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const newlinePattern = /\r?\n|\r/;
    if (newlinePattern.test(this.cleanMessage)) {
      throw new MessageSchemaError("Newlines are not allowed in the message.");
    }
    return true;
  }
}

export class NoFirstLineCharactersValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const firstLine = this.cleanMessage.split(" ")[0] ?? "";
    const nonDigitPattern = /[^\d.]/;
    if (nonDigitPattern.test(firstLine)) {
      throw new MessageSchemaError("First line must be a number.");
    }
    return true;
  }
}

export class ShouldContainCharactersAfterFirstLineValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const parts = this.cleanMessage.split(" ");
    const charPattern = /\S/;
    if (parts.length < 2 || !charPattern.test(parts[1] ?? "")) {
      throw new MessageSchemaError("Message must contain characters after the first line.");
    }
    return true;
  }
}

export class MessageContainOnlyNumberAtStartOneTimeValidation extends MessageSchemaValidation {
  override checkMessage(): boolean {
    const numberPattern = /^\d+(\.\d+)?\s+[^\d\s][^\d]*$/g;
    const numbers = this.cleanMessage.match(numberPattern) ?? [];
    if (numbers.length > 1) {
      throw new MessageSchemaError("Message can only contain one number at the start.");
    }
    return true;
  }
}
