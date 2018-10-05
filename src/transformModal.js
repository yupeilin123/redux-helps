import { takeEvery } from 'redux-saga/effects';
import checkState from './utils/checkState';

/**
 * 
 * @param {object | array} rootModal 
 * @return {object<reducers>}
 * @return {generator function<sagas>}
 */
export default function transformModal(rootModal) {
  const { state, reducers: modalReducers, sagas: modalSagas } = rootModal;
  // reduces
  let plainState = state;
  if (plainState && !checkState(plainState)) {
    plainState = {};
  }
  const reducers = (defaultState = { ...plainState }, action) => {
    if (action.type === 'setState') {
      return { ...defaultState, ...action.payload };
    }
    if (typeof modalReducers[action.type] === 'function') {
      return modalReducers[action.type](defaultState, { payload: action.payload });
    }
    return defaultState;
  };
  // sagas
  const middleSagas = {};
  Object.keys(modalSagas).forEach(fname => {
    if (typeof modalSagas[fname] === 'function') {
      middleSagas[fname] = modalSagas[fname];
    }
  });
  const sagas = function* everySaga() {
    for (const type in middleSagas) {
      yield takeEvery(type, middleSagas[type]);
    }
  };
  return { reducers, sagas };
}