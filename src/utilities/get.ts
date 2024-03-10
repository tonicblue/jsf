export default function get (object: any, path: string) {
  const parts = path.split('.');
  let current: any = object;

  for (const part of parts) {
    if (!(part in current))
      throw new Exception(`Invalid path '${path}'. Got stuck at ${part}`);

    current = current[part];
  }

  return current;
}