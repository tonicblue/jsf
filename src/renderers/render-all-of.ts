import { renderSchema } from "../schema";
import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";

export default function renderAllOf (frame: Frame) {
  const { schema, schemaPathStack, dataPathStack, root, data } = frame;

  if (!schema.allOf) return '';

  const html = [];
  schemaPathStack.push('allOf');

  for (const [index, value] of Object.entries(schema.allOf)) {
    schemaPathStack.push(index);
    html.push(renderSchema({ root, schema: value, schemaPathStack, dataPathStack, data }));
    schemaPathStack.pop();
  }

  schemaPathStack.pop();

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