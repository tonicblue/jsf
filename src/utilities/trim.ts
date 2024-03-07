export default function trim (input: string) {
  input.replace(/(^[\s\t\n]+)|([\s\n\t]+)$/gm, '');
}