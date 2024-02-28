import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, renderAttributes } from "../renderer";

export default function renderNumber ({ root, schema, pathStack }: Frame) {
  return /*html*/dedent`
    ${c(schema.$labelBeforeBegin)}
    <label ${renderAttributes(schema.$label)}>
      ${c(schema.$labelAfterBegin, schema.$spanBeforeBegin)}
      <span ${renderAttributes(schema.$span)}>
        ${c(schema.$spanAfterBegin, schema.title, schema.$spanBeforeEnd)}
      </span>
      ${c(schema.$spanAfterEnd, schema.$inputBeforeBegin)}
      <input type="${schema.const ? 'checkbox' : 'number'}"
        data-schema-path="${pathStack.join('/')}"
        data-type="number"
        value="${schema.const ?? schema.default ?? ''}"
        ${renderAttributes(schema.$input)}>
      ${c(schema.$inputAfterEnd, schema.$labelBeforeEnd)}
    </label>
    ${c(schema.$labelAfterEnd)}
  `;
}
