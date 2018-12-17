import { takeEvery } from 'redux-saga/effects';

/**
 * 
 * @param {object} rootSaga 
 * @return {generator function}
 */
export default function transformEffect(rootSaga) {
  const sagas = {};
  Object.keys(rootSaga).forEach(fname => {
    if (typeof rootSaga[fname] === 'function') {
      sagas[fname] = rootSaga[fname];
    }
  });
  return function* everySagas() {
    for (const type in sagas) {
      yield takeEvery(type, sagas[type]);
    }
  };
} 