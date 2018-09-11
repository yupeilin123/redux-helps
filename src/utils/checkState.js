export default function checkState(state) {
  return (typeof state === 'object' && state !== null) || Object.prototype.toString.call(state) === '[object Object]';
}