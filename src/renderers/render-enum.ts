import type { Frame } from "../frame";
import renderNotImplemented from "./render-not-implemented";

export default function renderEnum ({ root, schema, pathStack }: Frame) {
  return renderNotImplemented('renderEnum', { root, schema, pathStack });
}