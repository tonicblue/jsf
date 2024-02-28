import type { Frame } from "../frame";
import renderNotImplemented from "./render-not-implemented";

export default function renderNot ({ root, schema, pathStack }: Frame) {
  return renderNotImplemented('renderNot', { root, schema, pathStack });
}