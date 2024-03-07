import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderAnyOf (frame: Frame) {
  const { schema, pathStack, root, data } = frame;

  if (!schema.anyOf) return '';

  const html = [];
  pathStack.push('anyOf');

  for (const [index, value] of Object.entries(schema.anyOf)) {
    pathStack.push(index);
    html.push(renderSchema({ root, schema: value, pathStack, data }));
    pathStack.pop();
  }

  pathStack.pop();

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