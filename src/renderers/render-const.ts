import type { Frame } from "../frame";
import renderNotImplemented from "./render-not-implemented";

export default function renderConst ({ root, schema, pathStack }: Frame) {
  return renderNotImplemented('renderConst', { root, schema, pathStack });
}