import { renderSchema } from "../schema";
import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, j } from "../renderer";

export default function renderProperties ({ root, schema, pathStack }: Frame) {
  const html = [];
  pathStack.push('properties');

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      pathStack.push(key);
      html.push(renderSchema({ root, schema: value, pathStack }));
      pathStack.pop();
    }
  }

  pathStack.pop();

  return /*html*/dedent`
    ${c(schema.$propertiesBeforeBegin)}
    <div data-schema-path="properties">
      ${j('\n',
        schema.$propertiesAfterBegin,
        html.join(''),
        schema.$propertiesBeforeEnd)
      }
    </div>
    ${c(schema.$propertiesAfterBegin)}
  `;
}