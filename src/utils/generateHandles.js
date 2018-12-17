/**
 * 
 * @param {Object} handles 
 * @param {String} namespace 
 * @return {Object}
 */
export default function generateHandles(handles, namespace) {
  const finalHandles = {};
  for (const key in handles) {
    const actionName = namespace + '/' + key;
    finalHandles[actionName] = handles[key];
  }
  return finalHandles;
}