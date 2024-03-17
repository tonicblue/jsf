import Path from 'path';
import Fs from 'fs';

const docs: string[] = [`# todos and that\n`];

scanDirectory(Path.join(__dirname, '..', 'src'));

Fs.writeFileSync(Path.join(__dirname, '..', 'DOCS.md'), docs.join('\n'));

function scanDirectory (path: string) {
  const dirPaths = Fs.readdirSync(path, { withFileTypes: true });

  for (const dirEntry of dirPaths) {
    const dirEntryPath = Path.join(path, Path.sep, dirEntry.name);

    if (dirEntry.isDirectory()) scanDirectory(dirEntryPath);
    else extractDocs(dirEntryPath);
  }
}

function extractDocs (path: string) {
  const contents = Fs.readFileSync(path).toString();
  const matches = contents.matchAll(/(?:\/\/\s)(TODO|NOTE|BUG|HACK|TYPEHACK|QUESTION)(?:\:) (.*?)$/gm);

  if (!matches) return;

  const pathDocs: string[] = [];

  for (const [ _, type, note ] of matches) {
    pathDocs.push(`${type}: ${note}\n`);
  }

  if (pathDocs.length) docs.push(`## ${path}\n`, ...pathDocs, '\n');
}