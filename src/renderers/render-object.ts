import type { Frame } from "../frame";
import { renderHtmlNodes } from "../renderer";
import renderAllOf from "./render-all-of";
import renderAnyOf from "./render-any-of";
import renderOneOf from "./render-one-of";
import renderProperties from "./render-properties";

export default function renderObject (frame: Frame) {
  const { schema } = frame;
  const html = [];

  const parts = {
    properties: renderProperties(frame),
    allOf: renderAllOf(frame),
    anyOf: renderAnyOf(frame),
    oneOf: renderOneOf(frame),
  }

  html.push(parts.properties, parts.allOf, parts.anyOf, parts.oneOf);

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
      html.join(''),
      schema.$fieldsetBeforeEnd,
    ],
    schema.$fieldsetAfterEnd
  );
}