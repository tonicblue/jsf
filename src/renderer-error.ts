import Exception from "./exception";

export default class RendererError extends Exception {
  constructor (message: string, public schema: any, public schemaPathStack: string[]) {
    super(message);

    Object.setPrototypeOf(this, RendererError.prototype);
  }
}