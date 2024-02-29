import { renderSchema } from "../schema";
import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, j, renderAttributes } from "../renderer";

export default function renderAnyOf ({ root, schema, pathStack }: Frame) {
  if (!schema.anyOf) return '';

  const html = [];
  pathStack.push('anyOf');

  for (const [index, value] of Object.entries(schema.anyOf)) {
    pathStack.push(index);
    html.push(renderSchema({ root, schema: value, pathStack }));
    pathStack.pop();
  }

  pathStack.pop();

  return dedent/*html*/`
    ${c(schema.$anyOfBeforeBegin)}
    <fieldset jsf-any-of ${renderAttributes(schema.$anyOf)}>
      ${j(
        schema.$anyOfAfterBegin,
        html.join(''),
        schema.$anyOfBeforeEnd
      )}
    </fieldset>
    ${c(schema.$anyOfAfterEnd)}
  `;
}