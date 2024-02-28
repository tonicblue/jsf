import Exception from "./exception";

export default class NotImplementedError extends Exception {
  constructor (message: string, public filepath: string) {
    super(`The function '${message}()' has not yet been implemented in ${filepath}`);

    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}