/**
 * 生成带有前缀（namespace）的函数
 * 
 * @param {Object} handles reduces集合
 * @param {String} namespace 
 * @return {Object}
 */
export default function generatePrefixHandle(handles, namespace) {
  const prefixHandleMap = {};
  Object.keys(handles).forEach(key => {
    const actionName = namespace.endsWith('/') ? namespace + key : namespace + '/' + key;
    prefixHandleMap[actionName] = handles[key];
  });
  return prefixHandleMap;
}
