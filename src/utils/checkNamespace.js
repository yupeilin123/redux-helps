/**
 * 检测namespace是否是个字符串
 * 
 * @param {String} params 
 * @returns {Boolean}
 */
export default function checkNamespace(params) {
  return typeof params === 'string' && params.trim().length !== 0;
}