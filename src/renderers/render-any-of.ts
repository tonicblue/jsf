import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderAnyOf (frame: Frame) {
  const { schema, schemaPathStack, dataPathStack, root, data } = frame;

  if (!schema.anyOf) return '';

  const html = [];
  schemaPathStack.push('anyOf');

  for (const [index, value] of Object.entries(schema.anyOf)) {
    schemaPathStack.push(index);
    html.push(renderSchema({ root, schema: value, schemaPathStack, dataPathStack, data }));
    schemaPathStack.pop();
  }

  schemaPathStack.pop();

  return renderHtmlNodes(
    schema.$anyOfBeforeBegin,
    ['fieldset', schema.$anyOf,
      schema.$anyOfAfterBegin,
      html.join(''),
      schema.$anyOfBeforeEnd
    ],
    schema.$anyOfAfterEnd,
  );
}