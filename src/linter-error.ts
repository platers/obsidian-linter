
export class LinterError extends Error {
  constructor(msg: string, cause: Error) {
    super(msg);

    this.cause = cause ?? null;
    this.stack = cause.stack ?? null;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LinterError.prototype);
  }
}
