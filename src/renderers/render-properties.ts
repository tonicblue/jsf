import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderProperties (frame: Frame) {
  const { schema, pathStack, root, data } = frame;
  const html = [];
  pathStack.push('properties');

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      pathStack.push(key);
      html.push(renderSchema({ root, schema: value, pathStack, data }));
      pathStack.pop();
    }
  }

  const $properties = {
    ...(schema.$properties || {}),
    jsfSchemaPath: pathStack.join('/'),
    jsfProperties: true,
  };
  pathStack.pop();

  return renderHtmlNodes(
    schema.$propertiesBeforeBegin,
    ['fieldset',  $properties,
      schema.$propertiesAfterBegin,
      html.join(''),
      schema.$propertiesBeforeEnd
    ],
    schema.$propertiesAfterEnd,
  );
}