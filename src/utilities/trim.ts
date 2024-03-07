export default function trim (input: string) {
  return input.replace(/(^[\s\t\n]+)|([\s\n\t]+)$/gm, '');
}