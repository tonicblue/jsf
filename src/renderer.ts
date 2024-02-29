// TODO: update all html rendering to use something like the the `renderNode()` method which auto
// wraps elements opening and closing tags given a schema

import dedent from "./dedent";
import type { Frame } from "./frame";
import isObject from "./is-object";
import RendererError from "./renderer-error";

export type Attributes = Record<string, string | number | boolean>;

export function renderAttributes (attributes: Attributes) {
  if (!isObject(attributes))
    return '';

  const html = Object.entries(attributes)
    .filter(([, value]) => value != null && value !== false)
    .map(([key, value]) => {
      // TODO: improve how i snake-case inputs maybe? is this the best way?
      const attribute = key.replace(/([A-Z]{1})([a-z])/g, '-$1$2')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/(^-?)(.*?)(-?$)/, '$2');

      if (value === true) return attribute;

      // TYPEHACK: this is never hit because we filter `false` and nullish values above
      if (value === false) return '';

      return `${attribute}="${htmlEntities(value)}"`;
    })
    .join(' ');

  if (!html) return '';

  return ` ${html}`;
}

export function htmlEntities(str: string | number) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const templateCache: Record<string, () => string> = {};

export function renderHtmlTemplate (template: string, { root, schema, pathStack }: Frame, attributes: Record<string, Record<string, string>> = {}) {
  if (!templateCache[template])
    templateCache[template] = new Function(`return \`${template}\`;`) as () => string;

  let rendered = templateCache[template].call({ root, schema, pathStack });

  for (const [key, value] of Object.entries(attributes)) {
    const tagName = key.match(/^(?:\$)([a-z]+)(?:Attributes)$/)?.[0];

    if (!tagName) continue;

    const tagRegex = new RegExp(`\<${tagName} `);

    if (!rendered.match(tagRegex))
      throw new RendererError(`Schema template missing HTML tag <${tagName}>`, schema, pathStack);

    rendered = rendered.replace(tagRegex, `<${tagName} ${renderAttributes(value)}`);
  }

  return rendered;
}

// TODO: maybe flip this around so this method expects an array of nodes so it can handle strings or tuples
type HtmlNode = [tagName: string, attributes: Record<string, string>, ...(HtmlNode | string | undefined | null)[]]
export function renderJsonHtml ([tagName, attributes, ...childeNodes]: HtmlNode) {
  const attributesHtml = renderAttributes(attributes);
  const html: string[] = [];

  for (const node of childeNodes) {
    if (!node) continue;
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return renderJsonHtml(node)
  }

  return dedent/*html*/`
    <${tagName} ${attributesHtml}>
      ${html.join('')}
    </${tagName}>
  `;
}

export function c (...args: any[]) {
  return j('', ...args);
}

export function j (delimiter: string, ...args: any[]) {
  return args.filter(arg => arg != null).join(delimiter);
}