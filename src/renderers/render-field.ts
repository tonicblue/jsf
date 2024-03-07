import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, renderAttributes, type Attributes, renderHtmlNodes, renderHtmlNode } from "../renderer";
import type { Schema } from "../schema";

export function renderString ({ root, schema, pathStack }: Frame) {
  if (schema.enum == null) return renderTextLikeField({ root, schema, pathStack });

  if (schema.$input?.type == 'radio') return renderRadioField({ root, schema, pathStack });

  return renderSelectField({ root, schema, pathStack });
}

function renderTextLikeField({ root, schema, pathStack }: Frame) {
  const { $input = {} } = schema;

  switch (schema.format) {
    case ('email'):
    case ('idn-email'):
      $input.type = 'email';
      $input.maxlength = 255;
      $input.pattern = '^\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$';
      break;

    case ('uri'):
    case ('uri-reference'):
      $input.type = 'url';
      // SOURCE: https://datatracker.ietf.org/doc/html/rfc3986#appendix-B
      $input.pattern = '^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$'
      break;

    case ('uri-template'):
      $input.type = 'text';
      // SOURCE: https://stackoverflow.com/a/61645285
      $input.pattern = '^([^\x00-\x20\x7f"\'%<>\\^`{|}]|%[0-9A-Fa-f]{2}|{[+#./;?&=,!@|]?((\w|%[0-9A-Fa-f]{2})(\.?(\w|%[0-9A-Fa-f]{2}))*(:[1-9]\d{0,3}|\*)?)(,((\w|%[0-9A-Fa-f]{2})(\.?(\w|%[0-9A-Fa-f]{2}))*(:[1-9]\d{0,3}|\*)?))*})*$';
      break;

    case ('date-time'):
      $input.type = 'datetime-local';
      break;

    case ('time'):
      $input.type = 'time';
      break;

    case ('date'):
      $input.type = 'date';
      break;

    case ('duration'):
      $input.type = 'text';
      // SOURCE: https://stackoverflow.com/a/32045167
      $input.pattern = '^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$';
      break;

    case ('hostname'):
    case ('idn-hostname'):
      $input.type = 'text';
      // SOURCE: https://stackoverflow.com/a/12311250
      $input.pattern = '^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$';
      break;

    case ('ipv4'):
      $input.type = 'text';
      // SOURCE: https://stackoverflow.com/a/36760050
      $input.pattern = '^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$';
      break;

    case ('ipv6'):
      $input.type = 'text';
      // SOURCE: https://stackoverflow.com/a/36760050
      $input.pattern = '^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$';
      break;

    case ('uuid'):
      $input.type = 'text';
      // SOURCE: https://stackoverflow.com/a/13653180
      $input.pattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$';
      break;

    case ('json-pointer'):
    case ('relative-json-pointer'):
      $input.type = 'text';
      // SOURCE: https://www.regextester.com/98146
      $input.pattern = '^(\/?(([^/~])|(~[01]))*)$';
      break;

    // case ('iri'):
    // case ('iri-reference'):
    // case ('regex'):
    default:
      $input.type = 'text';
      break;
  }

  if (schema.pattern != null) $input.pattern = schema.pattern;
  if (schema.minLength != null) $input.minlength = schema.minLength;
  if (schema.maxLength != null) $input.maxlength = schema.maxLength;
  if (schema.const != null) $input.readonly = true;

  $input.value = schema.const ?? schema.default ?? '';
  $input.jsfDataType = 'string';
  $input.jsfSchemaPath = pathStack.join('/');

  return renderInputField({ ...schema, $input });
}

export function renderInteger ({ root, schema, pathStack }: Frame) {
  const { $input = {} } = schema;

  $input.type = 'number';
  $input.value = schema.const ?? schema.default ?? '';
  $input.jsfDataType = 'integer';
  $input.jsfSchemaPath = pathStack.join('/');

  if (schema.multipleOf) $input.step = schema.multipleOf;
  if (schema.minimum) $input.min = schema.minimum;
  if (schema.exclusiveMinimum) $input.min = schema.exclusiveMinimum + 1;
  if (schema.maximum) $input.max = schema.maximum;
  if (schema.exclusiveMaximum) $input.max = schema.exclusiveMaximum - 1;

  return renderInputField({ ...schema, $input });
}

export function renderNumber ({ root, schema, pathStack }: Frame) {
  const { $input = {} } = schema;

  $input.type = 'number';
  $input.value = schema.const ?? schema.default ?? '';
  // TODO: Implement ability to set step with different intervals;
  $input.jsfDataType = 'number';
  $input.jsfSchemaPath = pathStack.join('/');

  if (schema.multipleOf) $input.step = schema.multipleOf;
  if (schema.minimum) $input.min = schema.minimum;
  if (schema.exclusiveMinimum) $input.min = schema.exclusiveMinimum + 1;
  if (schema.maximum) $input.max = schema.maximum;
  if (schema.exclusiveMaximum) $input.max = schema.exclusiveMaximum - 1;

  return renderInputField({ ...schema, $input });
}

export function renderBoolean ({ root, schema, pathStack }: Frame) {
  const { $input = {} } = schema;

  $input.type = 'checkbox';
  $input.jsfDataType = 'boolean';
  $input.jsfSchemaPath = pathStack.join('/');

  if (schema.default === true) $input.checked = true;
  if (schema.const != null) $input.readonly = true;

  return renderInputField({ ...schema, $input });
}

export function renderInputField (schema: Schema) {
  const inputHtml = renderHtmlNodes(
    schema.$inputBeforeBegin,
    ['input', schema.$input],
    schema.$inputAfterEnd,
  );

  return renderField(schema, inputHtml);
}

export function renderTextareaField (schema: Schema) {
  const textareaHtml = renderHtmlNodes(
    schema.$textareaBeforeBegin,
    ['textarea', schema.$textarea, (schema.const ?? schema.default ?? '')],
    schema.$textareaAfterEnd,
  );

  return renderField(schema, textareaHtml);
}

function renderRadioField({ root, schema, pathStack }: Frame) {
  const optionsHtml = (schema.enum || []).map((option) => {
    const checked = (
      schema.const != null
        ? option == schema.const
        : option == schema.default
    );
    const $input: Attributes = {
      type: 'radio',
      value: `${option}`,
      jsfDataType: typeof option,
      checked, ...schema.$input
    };

    return renderInputField({ ...schema, $input, title: '' + option })
  }).join('\n');

  return renderHtmlNodes(
    schema.$fieldsetBeforeBegin,
    ['fieldset', schema.$fieldset, 
      schema.$fieldsetAfterBegin, 
      schema.$legendBeforeBegin,
      ['legend', schema.$legend,
        schema.$legendAfterBegin, 
        schema.title, 
        schema.$legendBeforeEnd,
      ],
      schema.$afterLegend, 
      schema.$optionBefore, 
      optionsHtml, 
      schema.$optionsAfter, 
      schema.$fieldsetBeforeEnd,
    ],
    schema.$fieldsetAfterEnd,
  );
}

export function renderSelectField ({ root, schema, pathStack }: Frame) {
  const optionsHtml = (schema.enum || []).map((option) => {
    const selected = (
      schema.const != null
        ? option == schema.const
        : option == schema.default
    );
    const $option: Attributes = {
      value: `${option}`,
      jsfDataType: typeof option,
      selected
    };

    return renderHtmlNode('option', $option, option);
  }).join('\n');

  const { $select = {} } = schema;

  $select.jsfSchemaPath = pathStack.join('/');

  const selectHtml = renderHtmlNodes(
    schema.$selectBeforeBegin,
    ['select', $select, optionsHtml],
    schema.$selectAfterEnd,
  );

  return renderField(schema, selectHtml);
}

export function renderField (schema: Schema, fieldHtml: string) {
  return renderHtmlNodes(
    schema.$labelBeforeBegin,
    ['label', schema.$label,
      schema.$labelAfterBegin, 
      schema.$spanBeforeBegin,
      ['span', schema.$span,
        schema.$spanAfterBegin, 
        schema.title, 
        schema.$spanBeforeEnd,
      ],
      schema.$spanAfterEnd, 
      fieldHtml, 
      schema.$labelBeforeEnd,
    ],
    schema.$labelAfterEnd,
  );
}