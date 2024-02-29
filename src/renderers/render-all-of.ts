import { renderSchema } from "../schema";
import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, j, renderAttributes } from "../renderer";

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

  return dedent/*html*/`
    ${c(schema.$allOfBeforeBegin)}
    <fieldset jsf-all-of ${renderAttributes(schema.$allOf)}>
      ${j(
        schema.$allOfAfterBegin,
        html.join(''),
        schema.$allOfBeforeEnd
      )}
    </fieldset>
    ${c(schema.$allOfAfterEnd)}
  `;
}