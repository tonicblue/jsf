import dedent from "./dedent";
import type { Frame } from "./frame";
import renderArray from "./renderers/render-array";
import renderEnum from "./renderers/render-enum";
import { renderString, renderNumber, renderInteger, renderBoolean } from "./renderers/render-field";
import renderObject from "./renderers/render-object";
import Exception from "./exception";

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

export function renderSchema (frame: Frame) : string {
  const { schema, schemaPathStack } = frame;

  switch (schema.type) {
    case ('string'):
      return renderString(frame);

    case ('number'):
      return renderNumber(frame);

    case ('integer'):
      return renderInteger(frame);

    case ('boolean'):
      return renderBoolean(frame);

    case ('enum'):
      return renderEnum(frame);

    case ('array'):
      return renderArray(frame);

    case ('object'):
      return renderObject(frame);

    default:
      return dedent/*html*/`
        <div class="text-error">
          <strong>Unrecognised schema: ${schema.type}</strong>
          <pre>${schemaPathStack.join('/')}</pre>
          <pre>${JSON.stringify(schema, null, 2)}</pre>
        </div>
      `;
  }
}

// TODO: Add $defs support
export function resolveSchemaPath (schema: Schema, path: string) {
  const pathParts = path.split('/');
  const currentPath: string[] = [];
  let currentNode: any = { ...schema };

  if (pathParts[0] === '') pathParts.shift();

  for (const part of pathParts) {
    if (currentNode[part] == null)
      throw new Exception(`Invalid path: '${path}'. Could not find '${part}' at '/${currentPath.join('/')}'`);

    currentPath.push(part);
    currentNode = currentNode[part];
  }

  return currentNode;
}