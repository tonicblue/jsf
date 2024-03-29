export type HTMLTags = {
  a: HTMLAnchorElement;
  abbr: HTMLElement;
  address: HTMLElement;
  area: HTMLAreaElement;
  article: HTMLElement;
  aside: HTMLElement;
  audio: HTMLAudioElement;
  b: HTMLElement;
  bdi: HTMLElement;
  bdo: HTMLElement;
  blockquote: HTMLQuoteElement;
  body: HTMLBodyElement;
  br: HTMLBRElement;
  button: HTMLButtonElement;
  canvas: HTMLCanvasElement;
  caption: HTMLElement;
  cite: HTMLElement;
  code: HTMLElement;
  col: HTMLElement;
  colgroup: HTMLElement;
  command: HTMLElement;
  datalist: HTMLDataListElement;
  dd: HTMLDataListElement;
  del: HTMLElement;
  details: HTMLDetailsElement;
  dfn: HTMLElement;
  div: HTMLDivElement;
  dl: HTMLDataListElement;
  dt: HTMLDataListElement;
  em: HTMLSpanElement;
  embed: HTMLEmbedElement;
  fieldset: HTMLFieldSetElement;
  figcaption: HTMLElement;
  figure: HTMLElement;
  footer: HTMLElement;
  form: HTMLFormElement;
  h1: HTMLHeadingElement;
  h2: HTMLHeadingElement;
  h3: HTMLHeadingElement;
  h4: HTMLHeadingElement;
  h5: HTMLHeadingElement;
  h6: HTMLHeadingElement;
  header: HTMLElement;
  hr: HTMLHRElement;
  html: HTMLHtmlElement;
  i: HTMLSpanElement;
  iframe: HTMLIFrameElement;
  img: HTMLImageElement;
  input: HTMLInputElement;
  ins: HTMLElement;
  kbd: HTMLElement;
  keygen: HTMLElement;
  label: HTMLLabelElement;
  legend: HTMLLegendElement;
  li: HTMLLIElement;
  main: HTMLElement;
  map: HTMLMapElement;
  mark: HTMLElement;
  menu: HTMLMenuElement;
  meter: HTMLMeterElement;
  nav: HTMLElement;
  object: HTMLObjectElement;
  ol: HTMLOListElement;
  optgroup: HTMLOptGroupElement;
  option: HTMLOptionElement;
  output: HTMLOutputElement;
  p: HTMLParagraphElement;
  param: HTMLParamElement;
  pre: HTMLPreElement;
  progress: HTMLProgressElement;
  q: HTMLElement;
  rp: HTMLElement;
  rt: HTMLElement;
  ruby: HTMLElement;
  s: HTMLElement;
  samp: HTMLElement;
  section: HTMLElement;
  select: HTMLSelectElement;
  small: HTMLElement;
  source: HTMLSourceElement;
  span: HTMLSpanElement;
  strong: HTMLElement;
  sub: HTMLElement;
  summary: HTMLElement;
  sup: HTMLElement;
  table: HTMLTableElement;
  tbody: HTMLTableSectionElement;
  td: HTMLTableCellElement;
  textarea: HTMLTextAreaElement;
  tfoot: HTMLTableSectionElement;
  th: HTMLElement;
  thead: HTMLTableSectionElement;
  time: HTMLTimeElement;
  tr: HTMLElement;
  track: HTMLTrackElement;
  u: HTMLElement;
  ul: HTMLElement;
  var: HTMLElement;
  video: HTMLVideoElement;
  wbr: HTMLElement;
}

export type HTMLNode = [keyof HTMLTags, ]