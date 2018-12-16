export default function checkNamespace(params) {
  return typeof params === 'string' && params.trim().length !== 0;
}