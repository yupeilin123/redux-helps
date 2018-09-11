export default function checkNamespace(namespace) {
  return typeof namespace === 'string' || Object.prototype.toString.call(namespace) === '[object String]';
}