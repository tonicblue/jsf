import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderOneOf (frame: Frame) {
  const { schema, pathStack, root, data } = frame;

  if (!schema.oneOf) return '';

  const html = [];
  pathStack.push('oneOf');

  for (const [index, value] of Object.entries(schema.oneOf)) {
    pathStack.push(index);
    html.push(renderSchema({ root, schema: value, pathStack, data }));
    pathStack.pop();
  }

  pathStack.pop();

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