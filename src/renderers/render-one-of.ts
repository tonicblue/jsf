import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderOneOf (frame: Frame) {
  const { schema, schemaPathStack, dataPathStack, root, data } = frame;

  if (!schema.oneOf) return '';

  const html = [];
  schemaPathStack.push('oneOf');

  for (const [index, value] of Object.entries(schema.oneOf)) {
    schemaPathStack.push(index);
    html.push(renderSchema({ root, schema: value, schemaPathStack, dataPathStack, data }));
    schemaPathStack.pop();
  }

  schemaPathStack.pop();

  return renderHtmlNodes(
    schema.$oneOfBeforeBegin,
    ['fieldset', schema.$oneOf,
      schema.$oneOfAfterBegin,
      html.join(''),
      schema.$oneOfBeforeEnd
    ],
    schema.$oneOfAfterEnd,
  );
}