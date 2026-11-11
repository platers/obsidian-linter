
export class LinterError extends Error {
  constructor(msg: string, cause?: Error, stack?: string) {
    super(msg);

    this.cause = cause ?? null;
    this.stack = cause?.stack ?? stack ?? null;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LinterError.prototype);
  }
}
