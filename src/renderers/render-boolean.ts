import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, renderAttributes, renderJsonHtml } from "../renderer";

export default function renderBoolean ({ root, schema, pathStack }: Frame) {
  return /*html*/dedent`
    ${c(schema.$labelBeforeBegin)}
    <label ${renderAttributes(schema.$label)}>
      ${c(schema.$labelAfterBegin, schema.$spanBeforeBegin)}
      <span ${renderAttributes(schema.$span)}>
        ${c(schema.$spanAfterBegin, schema.title, schema.$spanBeforeEnd)}
      </span>
      ${c(schema.$spanAfterEnd, schema.$inputBeforeBegin)}
      <input type="checkbox"
        data-schema-path="${pathStack.join('/')}"
        data-type="boolean"
        ${schema.default === true ? 'checked' : ''}
        ${renderAttributes(schema.$input)}>
      ${c(schema.$inputAfterEnd, schema.$labelBeforeEnd)}
    </label>
    ${c(schema.$labelAfterEnd)}
  `;
}