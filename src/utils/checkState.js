/**
 * 判断state是不是对象
 * 
 * @param {Object} state 
 * @returns {Boolean}
 */
export default function checkState(state) {
  return Object.prototype.toString(state) === '[object Object]';
}