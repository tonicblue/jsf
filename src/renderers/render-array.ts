import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";
import renderObject from "./render-object";

export default function renderArray (frame: Frame) {
  const { schema } = frame;
  const items = Array.isArray(schema.items)
    ? schema.items
    : [schema.items ?? {}];
  const objectHtml = items.map((item) => renderObject({ ...frame, schema: item ?? {} })).join('\n');

  return renderHtmlNodes(
    schema.$fieldsetBeforeBegin,
    ['fieldset', schema.$fieldset,
      schema.$fieldsetAfterBegin,
      schema.$legendBeforeBegin,
      ['legend', schema.$legend,
        schema.$legendAfterBegin,
        schema.title,
        schema.$legendBeforeEnd
      ],
      schema.$fieldsetAfterEnd,
      schema.$itemsBeforeBegin,
      ['div', schema.$items,
        schema.$itemsAfterBegin,
        schema.$itemBeforeBegin,
        objectHtml,
        ['button', schema.$addNew, `Add item`],
        schema.$itemAfterEnd,
        schema.$itemsBeforeEnd,
      ],
      schema.$itemsAfterEnd,
      schema.$fieldsetBeforeEnd,
    ],
    schema.$fieldsetAfterEnd
  );
}