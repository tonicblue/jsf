import type { Frame } from "../frame";

export default function renderNotImplemented (func: string, frame: Frame) {
  return /*html*/`
    <p>
      <code>${func}()</code> not yet implemented yet
    </p>
    <pre>${pathStack.join('/')}</pre>
  `;
}