import { takeEvery } from 'redux-saga/effects';
import checkNamespace from './utils/checkNamespace';

/**
 * 
 * @param {object} rootSaga 
 * @return {generator function}
 */
export default function transformEffect(rootSaga) {
  let sagas = {};
  if (Object.prototype.hasOwnProperty.call(rootSaga, 'namespace')) {
    const { namespace, ...handles } = rootSaga;
    if (!checkNamespace(namespace)) {
      throw new Error('namespace\'s type must be a \'String\'');
    }
    Object.keys(handles).forEach(fname => {
      if (typeof handles[fname] === 'function') {
        sagas[`${namespace}/${fname}`] = handles[fname];
      }
    });
  } else {
    Object.keys(rootSaga).forEach(fname => {
      if (typeof rootSaga[fname] === 'function') {
        sagas[fname] = rootSaga[fname];
      }
    });
  }
  return function* everySagas() {
    for (const type in sagas) {
      yield takeEvery(type, sagas[type]);
    }
  };
} 