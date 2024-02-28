import type { Frame } from "../frame";
import renderNotImplemented from "./render-not-implemented";

export default function renderElse ({ root, schema, pathStack }: Frame) {
  return renderNotImplemented('renderElse', { root, schema, pathStack });
}