import type { Frame } from "../frame";
import renderNotImplemented from "./render-not-implemented";

export default function renderAdditionalProperties ({ root, schema, pathStack }: Frame) {
  return renderNotImplemented('renderAdditionalProperties', { root, schema, pathStack });
}