import { renderSchema } from "../schema";
import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, j, renderAttributes } from "../renderer";

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

  const $properties = {
    ...(schema.$properties || {}),
    jsfSchemaPath: pathStack.join('/'),
    jsfProperties: true,
  };
  pathStack.pop();

  return dedent/*html*/`
    ${c(schema.$propertiesBeforeBegin)}
    <fieldset ${renderAttributes($properties)}>
      ${j(
        schema.$propertiesAfterBegin,
        html.join(''),
        schema.$propertiesBeforeEnd
      )}
    </fieldset>
    ${c(schema.$propertiesAfterEnd)}
  `;
}