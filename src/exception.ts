export default class Exception extends Error {
  metadata: any;

  constructor (message: string, ...args: any[]) {
    super(message);

    this.metadata = args;
    Object.setPrototypeOf(this, Exception.prototype);
  }

  static fromError<T extends typeof Exception> (error: Error, ...args: any[]) {
    const exception = new this(error.message, ...args) as InstanceType<T>;
    exception.stack = error.stack;
    exception.cause = error.cause;

    return exception;
  }

  toSerialisable () {
    return JSON.parse(this.toJSON());
  }

  toJSON () {
    return JSON.stringify(this, Object.getOwnPropertyNames(this), 2);
  }
}