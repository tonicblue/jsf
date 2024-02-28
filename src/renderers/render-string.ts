import dedent from "../dedent";
import type { Frame } from "../frame";
import { c, renderAttributes } from "../renderer";

export default function renderString ({ root, schema, pathStack }: Frame) {
  const $input = { ...(schema.$input || {}) };

  switch (schema.format) {
    case ('email'):
    case ('idn-email'):
      $input.pattern = '^\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$';
      $input.maxlength = 255;
      $input.type = 'email';
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

  if (schema.pattern) $input.pattern = schema.pattern;
  if (schema.minLength) $input.minlength = schema.minLength;
  if (schema.maxLength) $input.maxlength = schema.maxLength;

  return /*html*/dedent`
    ${c(schema.$labelBeforeBegin)}
    <label ${renderAttributes(schema.$label)}>
      ${c(schema.$labelAfterBegin, schema.$spanBeforeBegin)}
      <span ${renderAttributes(schema.$span)}>
        ${c(schema.$spanAfterBegin, schema.title, schema.$spanBeforeEnd)}
      </span>
      ${c(schema.$spanAfterEnd, schema.$inputBeforeBegin)}
      <input type="${schema.const ? 'checkbox' : 'text'}"
        data-schema-path="${pathStack.join('/')}"
        data-type="string"
        value="${schema.const ?? schema.default ?? ''}"
        ${renderAttributes($input)}>
      ${c(schema.$inputAfterEnd, schema.$labelBeforeEnd)}
    </label>
    ${c(schema.$labelAfterEnd)}
  `;
}