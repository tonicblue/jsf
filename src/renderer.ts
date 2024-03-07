import dedent from "./dedent";
import isObject from "./utilities/is-object";
import trim from "./utilities/trim";

export type Attributes = Record<string, string | number | boolean>;
type HtmlChildNode = (HtmlNode | string | number | boolean | undefined | null);
type HtmlNode = [tagName: string, attributes: Attributes, ...HtmlChildNode[]]

export function renderAttributes (attributes: Attributes) {
  if (!isObject(attributes))
    return '';

  const html = Object.entries(attributes)
    .filter(([, value]) => value != null && value !== false)
    .map(([key, value]) => {
      // TODO: improve how i snake-case inputs maybe? is this the best way?
      const attribute = trim(key.replace(/[A-Z]/g, (letter) => `-${letter}`)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-{2,}/g, '-'));

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

export function renderHtmlNodes (...nodes: HtmlChildNode[]) {
  const html: string[] = [];

  for (const node of nodes) {
    if (!node) continue;
    if (typeof node === 'string') html.push(node);
    if (Array.isArray(node)) html.push(renderHtmlNode(...node));
  }

  return html.join('');
}

export function renderHtmlNode (tagName: string, attributes: Attributes, ...childeNodes: HtmlChildNode[]) {
  const attributesHtml = attributes
    ? renderAttributes(attributes)
    : ''
  const childHtml = renderHtmlNodes(...childeNodes);

  return dedent/*html*/`
    <${tagName} ${attributesHtml}>
      ${childHtml}
    </${tagName}>
  `;
}