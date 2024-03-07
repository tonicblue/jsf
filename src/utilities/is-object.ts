export default function isObject (test: any) {
  return (
    test != null &&
    typeof test === 'object' &&
    !Array.isArray(test)
  );
}