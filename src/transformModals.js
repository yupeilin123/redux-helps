import { takeEvery } from 'redux-saga/effects';
import checkNamespace from './utils/checkNamespace';
import checkState from './utils/checkState';
const randomString = () => Math.random().toString(36).substring(7).split('').join('.');

const staticNamespace = `reduxHelps@1.0.0.${randomString()}`;

/**
 * 
 * @param {object | array} rootModal 
 * @return {object<reducers>}
 * @return {generator function<sagas>}
 */
export default function transformModals(rootModal) {
  const reducers = {};
  const middleSagas = {};
  if (Array.isArray(rootModal)) {
    const len = rootModal.length;
    for (let i = 0; i < len; i += 1) {
      if (rootModal[i].default) {
        const { namespace, state, reducers: modalReducers, sagas: modalSagas } = rootModal[i].default;
        if (!checkNamespace(namespace)) {
          throw new Error('namespace\'s type must be a \'String\'');
        }
        let plainState = state;
        if (plainState && !checkState(plainState)) {
          plainState = {};
        }
        reducers[namespace] = (defaultState = { ...plainState }, action) => {
          if (action.type === 'setState') {
            return { ...defaultState, ...action.payload };
          }
          if (modalReducers[action.type] === 'function') {
            return modalReducers[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
        Object.keys(modalSagas).forEach(fname => {
          if (typeof modalSagas[fname] === 'function') {
            middleSagas[`${namespace}/${fname}`] = modalSagas[fname];
          }
        });
      }
    }
  } else {
    Object.keys(rootModal).forEach(type => {
      const { namespace, state, reducers: modalReducers, sagas: modalSagas } = rootModal[type];
      if (!checkNamespace(namespace)) {
        throw new Error('namespace\'s type must be a \'String\'');
      }
      let plainState = state;
      if (plainState && !checkState(plainState)) {
        plainState = {};
      }
      reducers[namespace] = (defaultState = { ...plainState }, action) => {
        if (action.type === 'setState') {
          return { ...defaultState, ...action.payload };
        }
        if (typeof modalReducers[action.type] === 'function') {
          return modalReducers[action.type](defaultState, { payload: action.payload });
        }
        return defaultState;
      };
      Object.keys(modalSagas).forEach(fname => {
        if (typeof modalSagas[fname] === 'function') {
          middleSagas[`${namespace}/${fname}`] = modalSagas[fname];
        }
      });
    });
  }
  if (Object.keys(reducers).length === 0) {
    reducers[staticNamespace] = () => {
      return {};
    };
  }
  const sagas = function* everySaga() {
    for (const type in middleSagas) {
      yield takeEvery(type, middleSagas[type]);
    }
  };
  return { reducers, sagas };
}