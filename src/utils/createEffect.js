/**
 * 
 * @param {Generate Function} genFn 
 */

export default function createEffect(genFn) {
  return function* sagaEffect(params) {
    const { _resolve, _reject, ...action } = params;
    if (_resolve && _reject) {
      try {
        const result = yield genFn(action);
        _resolve(result);
      } catch (err) {
        _reject(err);
      }
    } else {
      yield genFn(action);
    }
  };
}