import { takeEvery } from 'redux-saga/effects';
import checkNamespace from './utils/checkNamespace';

/**
 * 
 * @param {object | array} rootSaga 
 * @return {generator function}
 */
export default function transformSagas(rootSaga) {
  let sagas = {};
  if (Array.isArray(rootSaga)) {
    const len = rootSaga.length;
    for (let i = 0; i < len; i += 1) {
      if (rootSaga[i].default) {
        if (Object.prototype.hasOwnProperty.call(rootSaga[i].default, 'namespace')) {
          const { namespace, ...handles } = rootSaga[i].default;
          if (!checkNamespace(namespace)) {
            throw new Error('namespace\'s type must be a \'String\'');
          }
          Object.keys(handles).forEach(fname => {
            if (typeof handles[fname] === 'function') {
              sagas[`${namespace}/${fname}`] = handles[fname];
            }
          });
        } else {
          const handles = rootSaga[i].default;
          Object.keys(handles).forEach(fname => {
            if (typeof handles[fname] === 'function') {
              sagas[fname] = handles[fname];
            }
          });
        }
      }
    }
  } else {
    Object.keys(rootSaga).forEach(type => {
      const subSaga = rootSaga[type];
      if (Object.prototype.hasOwnProperty.call(subSaga, 'namespace')) {
        const { namespace, ...handles } = subSaga;
        if (!checkNamespace(namespace)) {
          throw new Error('namespace\'s type must be a \'String\'');
        }
        Object.keys(handles).forEach(fname => {
          if (typeof handles[fname] === 'function') {
            sagas[`${namespace}/${fname}`] = handles[fname];
          }
        });
      } else {
        Object.keys(subSaga).forEach(fname => {
          if (typeof subSaga[fname] === 'function') {
            sagas[fname] = subSaga[fname];
          }
        });
      }
    });
  }
  return function* everySagas() {
    for (const type in sagas) {
      yield takeEvery(type, sagas[type]);
    }
  };
}