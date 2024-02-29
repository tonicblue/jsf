import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, j, renderAttributes } from "../renderer";
import renderAllOf from "./render-all-of";
import renderAnyOf from "./render-any-of";
import renderOneOf from "./render-one-of";
import renderProperties from "./render-properties";

export default function renderObject ({ root, schema, pathStack }: Frame) {
  const html = [];

  const parts = {
    properties: renderProperties({ root, schema, pathStack }),
    allOf: renderAllOf({ root, schema, pathStack }),
    anyOf: renderAnyOf({ root, schema, pathStack }),
    oneOf: renderOneOf({ root, schema, pathStack }),
  }

  html.push(parts.properties, parts.allOf, parts.anyOf, parts.oneOf);

  return /*html*/dedent`
    ${c(schema.$fieldsetBeforeBegin)}
    <fieldset ${renderAttributes(schema.$fieldset)}>
      ${c(schema.$fieldsetAfterBegin, schema.$legendBeforeBegin)}
      <legend ${renderAttributes(schema.$legend)}>${c(
        schema.$legendAfterBegin,
        schema.title,
        schema.$legendBeforeEnd
      )}</legend>
      ${j(
        schema.$fieldsetAfterEnd,
        html.join(''),
        schema.$fieldsetBeforeEnd
      )}
    </fieldset>
    ${c(schema.$fieldsetAfterEnd)}
  `;
}