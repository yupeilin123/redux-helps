import { takeEvery } from 'redux-saga/effects';

export default function transformSaga(rootSaga) {
  const sagas = {};
  Object.keys(rootSaga).forEach(fname => {
    sagas[fname] = rootSaga[fname];
  });
  return function* everySagas() {
    for (const type in sagas) {
      yield takeEvery(type, sagas[type]);
    }
  };
} 