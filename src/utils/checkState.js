export default function checkState(state) {
  return (typeof state === 'object' && state !== null);
}