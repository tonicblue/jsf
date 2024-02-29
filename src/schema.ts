import dedent from "./dedent";
import type { Frame } from "./frame";
import isObject from "./is-object";
import renderArray from "./renderers/render-array";
import renderEnum from "./renderers/render-enum";
import { renderString, renderNumber, renderInteger, renderBoolean } from "./renderers/render-field";
import renderObject from "./renderers/render-object";

export type ElementPosition = 'BeforeBegin' | 'AfterBegin' | 'BeforeEnd' | 'AfterEnd';

export type Schema = {
  $id?: string;
  $schema?: string;
  $defs?: Record<string, Schema>;

  type?: string;
  title?: string;
  description?: string;
  default?: any;
  examples?: any[];
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;

  pattern?: string;
  minLength?: number;
  maxLength?: number;
  format?: (
    'date-time' | 'time' | 'date' | 'duration' | 'email' | 'idn-email' | 'hostname' |
    'idn-hostname' | 'ipv4' | 'ipv6' | 'uuid' | 'uri' | 'uri-reference' | 'iri' | 'iri-reference' |
    'uri-template' | 'json-pointer' | 'relative-json-pointer' | 'regex'
  );

  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;

  properties?: Record<string, Schema>;
  patternProperties?: Record<string, Schema>;

  enum?: (string | boolean | number)[]
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
  not?: Schema[];
  const?: any;
} & {[key in `$${string}` | `$${string}${ElementPosition}`]: any }

function resolve (schema: Schema, path: string | string[]) {

}

export function renderSchema ({ root, schema, pathStack }: Frame) : string {
  if (!isObject(schema))
    schema = {};

  // TODO: type inference
  switch (schema.type) {
    case ('string'):
      return renderString({ root, schema, pathStack });

    case ('number'):
      return renderNumber({ root, schema, pathStack });

    case ('integer'):
      return renderInteger({ root, schema, pathStack });

    case ('boolean'):
      return renderBoolean({ root, schema, pathStack });

    case ('enum'):
      return renderEnum({ root, schema, pathStack });

    case ('array'):
      return renderArray({ root, schema, pathStack });

    case ('object'):
      return renderObject({ root, schema, pathStack });

    default:
      return dedent`
        <div class="text-error">
          <strong>Unrecognised schema: ${schema.type}</strong>
          <pre>${pathStack.join('/')}</pre>
          <pre>${JSON.stringify(schema, null, 2)}</pre>
        </div>
      `;
  }
}