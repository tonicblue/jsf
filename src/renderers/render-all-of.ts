import { renderSchema } from "../schema";
import dedent from "../dedent";
import type { Frame } from "../frame";
import { c } from "../renderer";

export default function renderAllOf ({ root, schema, pathStack }: Frame) {
  if (!schema.allOf) return '';

  const html = [];
  pathStack.push('allOf');

  for (const [index, value] of Object.entries(schema.allOf)) {
    pathStack.push(index);
    html.push(renderSchema({ root, schema: value, pathStack }));
    pathStack.pop();
  }

  pathStack.pop();

  return /*html*/dedent`
    ${c(schema.$allOfBeforeBegin)}
    <div data-schema-path="allOf">
      ${c(schema.$allOfAfterBegin)}
      ${html.join('')}
      ${c(schema.$allOfBeforeEnd)}
    </div>
    ${c(schema.$allOfAfterBegin)}
  `;
}