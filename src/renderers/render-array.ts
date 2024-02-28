import type { Frame } from "../frame";
import renderNotImplemented from "./render-not-implemented";

export default function renderArray ({ root, schema, pathStack }: Frame) {
  return renderNotImplemented('renderArray', { root, schema, pathStack });
}