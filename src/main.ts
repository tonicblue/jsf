import './style.css'
import { renderSchema } from './schema';
import { createFrame } from './frame';
import ollama, { Message } from 'ollama';
import { jsonCloser } from './json-closer.js';
// import S from 'fluent-json-schema';
// import { renderHtmlNode } from './renderer';

const $app = document.querySelector('#app') as HTMLDivElement;
const $log = document.querySelector('#log') as HTMLPreElement;
const $prompt = document.querySelector('#prompt') as HTMLTextAreaElement;
const $generate = document.querySelector('#generate') as HTMLButtonElement;
const history: Exchange[] = [];

type Exchange = [prompt: string, response: string, $exchange: HTMLElement];

function startExchange (prompt: string) {
  const $exchange = document.createElement('article');
  $exchange.setAttribute('role', 'log');
  $exchange.innerHTML = /*html*/`
    <blockquote actor="user">${prompt}</blockquote>
    <blockquote actor="system"><pre></pre></blockquote>
  `;
  $log.appendChild($exchange);
  $log.scrollTop = $log.scrollHeight;
  history.push([prompt, '', $exchange]);
}

function writeToResponse (part: string) {
  const [prompt, response, $exchange] = history.pop() ?? [];

  if (prompt == null || response == null || $exchange == null)
    throw Error(`No exchange started for part: ${part}`);

  const $response = $exchange.querySelector('blockquote[actor=system] pre') as HTMLQuoteElement;
  $response.insertAdjacentHTML('beforeend', part);
  $log.scrollTop = $log.scrollHeight;
  history.push([prompt, response + part, $exchange]);
}

function getLastResponse () {
  return history[history.length - 1];
}

function getContext () {
  return history.map(([prompt, response]) => Object([
    { role: 'user', content: prompt },
    { role: 'assistant', content: response }
  ])).flat() as Message[];
}

function renderForm () {
  try {
    const schemaJson = jsonCloser(getLastResponse()[1]);
    const schema = JSON.parse(schemaJson);
    const frame = createFrame(schema);
    $app.innerHTML = renderSchema(frame);
  } catch (err) {
    console.error(err.message, err);
  }
}

async function generate () {
  $prompt.readOnly = true;
  const prompt = $prompt.value;
  $prompt.value = '';

  startExchange(prompt);

  const response = await ollama.chat({
    stream: true,
    model: 'mistral:7b',
    messages: [
      ...getContext(),
      {
        role: 'user',
        content: `
The word 'Form' means 'JSON Schema'.
Always generate a detailed JSON schema.
Always use titles on properties.
Do not include buttons in the JSON schema.
Respond using JSON.

${prompt}`,
      }
    ],
  });

  for await (const part of response) {
    writeToResponse(part.message.content);
    renderForm();
  }

  $app.insertAdjacentHTML('beforeend', `<button type="submit">Submit</button>`);
  $prompt.readOnly = false;
  $prompt.focus();
}

$prompt.addEventListener('keypress', (evt) => {
  if (!evt.shiftKey && evt.key === 'Enter') {
    evt.preventDefault();
    generate().then();
  }
});