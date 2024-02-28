import dedent from "./dedent";
import type { Frame } from "./frame";
import isObject from "./is-object";
import RendererError from "./renderer-error";

export function renderAttributes (attributes: Record<string, string>) {
  if (!isObject(attributes))
    return '';

  // TODO: Escaping attribute keys and values
  return Object.entries(attributes)
    .map(([key, value]) => `${key}=${value}"`)
    .join(' ');
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
// NOTE: started implementing this in renderers/render-boolean.ts

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