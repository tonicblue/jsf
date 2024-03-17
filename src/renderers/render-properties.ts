import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderProperties (frame: Frame) {
  const { schema, schemaPathStack, dataPathStack, root, data } = frame;
  const html = [];
  schemaPathStack.push('properties');

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      schemaPathStack.push(key);
      dataPathStack.push(key)
      html.push(renderSchema({ root, schema: value, schemaPathStack, dataPathStack, data }));
      schemaPathStack.pop();
      dataPathStack.pop();
    }
  }

  const $properties = {
    ...(schema.$properties || {}),
    jsfSchemaPath: schemaPathStack.join('/'),
    jsfProperties: true,
  };
  schemaPathStack.pop();

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