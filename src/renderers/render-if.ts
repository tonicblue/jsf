import type { Frame } from "../frame";
import renderNotImplemented from "./render-not-implemented";

export default function renderIf ({ root, schema, pathStack }: Frame) {
  return renderNotImplemented('renderIf', { root, schema, pathStack });
}