import './style.css'
import { renderSchema } from './schema';
import { createFrame } from './frame';
import ollama, { Message } from 'ollama';
import { jsonCloser } from './json-closer.js';
// import S from 'fluent-json-schema';
// import { renderHtmlNode } from './renderer';

const $form = document.querySelector('#form') as HTMLDivElement;
const $log = document.querySelector('#log') as HTMLPreElement;
const $prompt = document.querySelector('#prompt') as HTMLTextAreaElement;
const $reset = document.querySelector('#reset') as HTMLButtonElement;
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
  return history.map(([prompt]) => `-- User prompt --\n\n${prompt}`).join('\n\n');
}

function renderForm () {
  try {
    const schemaJson = jsonCloser(getLastResponse()[1]);
    const schema = JSON.parse(schemaJson);
    const frame = createFrame(schema);
    $form.innerHTML = renderSchema(frame);
  } catch (err) {
    console.error(err.message, err);
  }
}

async function generate () {
  document.body.classList.add('generating');
  $prompt.readOnly = true;
  const prompt = $prompt.value;
  $prompt.value = '';

  try {
    startExchange(prompt);

    const currentSchema = getLastResponse()?.[1] ?? '{ "type": "object", "title": "Form" }';
    const context = getContext();
    const response = await ollama.generate({
      stream: true,
      model: 'mistral:7b',
      format: 'json',
      system: `
        * The word 'Form' means 'JSON Schema'.
        * Always generate a detailed JSON schema.
        * Always use titles on properties.
        * Do not include buttons in the JSON schema.
        * Respond using JSON.

        -- Start of user's previous prompts --
        ${context}
        -- End of user's previous prompts --

        -- Start of current JSON schema --
        \`\`\`json
        ${currentSchema}
        \`\`\`
        -- End of current JSON schema --
      `,
      prompt,
    });

    for await (const part of response) {
      writeToResponse(part.response);
      renderForm();
    }
  } catch (err) {
    $form.innerHTML = `<strong>An error occurred:</strong> <code>${err.message}</code>`;
  }

  $form.insertAdjacentHTML('beforeend', `<button type="submit">Submit</button>`);
  document.body.classList.remove('generating');
  $prompt.readOnly = false;
  $prompt.focus();
}

document.querySelectorAll('.auto-grow').forEach(element => {
  element.addEventListener('input', ({target}) => {
    target.style.height = "5px";
    target.style.height = ($prompt.scrollHeight) + "px";
  });
})

$prompt.addEventListener('keypress', (evt) => {
  
  if (!evt.shiftKey && evt.key === 'Enter') {
    evt.preventDefault();
    generate().then();
  }
});

$reset.addEventListener('click', () => {
  while (history.length)
    history.pop();

  $log.innerHTML = '';
  $form.innerHTML = '';
});