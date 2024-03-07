import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderAllOf (frame: Frame) {
  const { schema, pathStack, root, data } = frame;

  if (!schema.allOf) return '';

  const html = [];
  pathStack.push('allOf');

  for (const [index, value] of Object.entries(schema.allOf)) {
    pathStack.push(index);
    html.push(renderSchema({ root, schema: value, pathStack, data }));
    pathStack.pop();
  }

  pathStack.pop();

  return renderHtmlNodes(
    schema.$allOfBeforeBegin,
    ['fieldset', schema.$allOf,
      schema.$allOfAfterBegin,
      html.join(''),
      schema.$allOfBeforeEnd
    ],
    schema.$allOfAfterEnd,
  );
}