import type { Frame } from "../frame";

export default function renderNotImplemented (func: string, { root, schema, pathStack }: Frame) {
  return /*html*/`
    <p>
      <code>${func}()</code> not yet implemented yet
    </p>
    <pre>${pathStack.join('/')}</pre>
  `;
}