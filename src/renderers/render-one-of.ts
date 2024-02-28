import { renderSchema } from "../schema";
import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, j } from "../renderer";

export default function renderOneOf ({ root, schema, pathStack }: Frame) {
  if (!schema.oneOf) return '';

  const html = [];
  pathStack.push('oneOf');

  for (const [index, value] of Object.entries(schema.oneOf)) {
    pathStack.push(index);
    html.push(renderSchema({ root, schema: value, pathStack }));
    pathStack.pop();
  }

  pathStack.pop();

  return /*html*/dedent`
    ${c(schema.$oneOfBeforeBegin)}
    <div data-schema-path="oneOf">
      ${j('\n',
        schema.$oneOfAfterBegin,
        html.join(''),
        schema.$oneOfBeforeEnd
      )}
    </div>
    ${c(schema.$oneOfAfterBegin)}
  `;
}