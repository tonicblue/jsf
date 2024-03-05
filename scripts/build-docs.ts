import { Glob } from 'bun';

const test = new Glob('src/**/*');
const files = Array.from(test.scanSync({}))
console.log(files);