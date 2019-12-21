import { takeEvery } from 'redux-saga/effects';
import checkNamespace from './utils/checkNamespace';
import checkState from './utils/checkState';
import generatePrefixHandle from './utils/generatePrefixHandle';
import createEffect from './utils/createEffect';
const randomString = () => Math.random().toString(36).substring(7).split('').join('.');

const staticNamespace = `reduxHelps@1.2.0-${randomString()}`;

/**
 * 
 * @param {object} rootModal 
 * @return {object<reducers>}
 * @return {generator function<sagas>}
 */
export default function transformModal(rootModal) {
  const reducers = {};
  const middleEffects = {};
  Object.keys(rootModal).forEach(type => {
    const { namespace, state, reducers: modalReducers = {}, effects: modalEffects = {} } = rootModal[type];
    if (!checkNamespace(namespace)) {
      throw new Error('namespace must be \'String\' and it\'s not null');
    }
    let plainState = state;
    if (!checkState(plainState)) {
      plainState = {};
    }
    const reducesHandles = generatePrefixHandle(modalReducers, namespace);
    reducers[namespace] = (defaultState = { ...plainState }, action) => {
      if (typeof reducesHandles[action.type] === 'function') {
        return reducesHandles[action.type](defaultState, { payload: action.payload });
      }
      return defaultState;
    };
    Object.keys(modalEffects).forEach(fname => {
      if (typeof modalEffects[fname] === 'function') {
        middleEffects[`${namespace}/${fname}`] = modalEffects[fname];
      }
    });
  });
  if (Object.keys(reducers).length === 0) {
    reducers[staticNamespace] = () => {
      return {};
    };
  }
  const effects = function* everySaga() {
    for (const type in middleEffects) {
      yield takeEvery(type, createEffect(middleEffects[type]));
    }
  };
  effects._middleEffects = middleEffects;
  return { reducers, effects };
}