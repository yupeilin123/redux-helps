import { takeEvery } from 'redux-saga/effects';
import checkNamespace from './utils/checkNamespace';
import checkState from './utils/checkState';
import generateHandles from './utils/generateHandles';
const randomString = () => Math.random().toString(36).substring(7).split('').join('.');

const staticNamespace = `reduxHelps@1.0.3-${randomString()}`;

/**
 * 
 * @param {object | array} rootModal 
 * @return {object<reducers>}
 * @return {generator function<sagas>}
 */
export default function transformModals(rootModal) {
  const reducers = {};
  const middleEffects = {};
  if (Array.isArray(rootModal)) {
    const len = rootModal.length;
    for (let i = 0; i < len; i += 1) {
      if (rootModal[i].default) {
        const { namespace, state, reducers: modalReducers, effects: modalEffects } = rootModal[i].default;
        if (!checkNamespace(namespace)) {
          throw new Error('namespace\'s type must be a \'String\'');
        }
        let plainState = state;
        if (plainState && !checkState(plainState)) {
          plainState = {};
        }
        const finalHandles = generateHandles(modalReducers, namespace);
        reducers[namespace] = (defaultState = { ...plainState }, action) => {
          if (finalHandles[action.type] === 'function') {
            return finalHandles[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
        Object.keys(modalEffects).forEach(fname => {
          if (typeof modalEffects[fname] === 'function') {
            middleEffects[`${namespace}/${fname}`] = modalEffects[fname];
          }
        });
      }
    }
  } else {
    Object.keys(rootModal).forEach(type => {
      const { namespace, state, reducers: modalReducers, effects: modalEffects } = rootModal[type];
      if (!checkNamespace(namespace)) {
        throw new Error('namespace must be \'String\' and it\'s not null');
      }
      let plainState = state;
      if (plainState && !checkState(plainState)) {
        plainState = {};
      }
      const finalHandles = generateHandles(modalReducers, namespace);
      reducers[namespace] = (defaultState = { ...plainState }, action) => {
        if (typeof finalHandles[action.type] === 'function') {
          return finalHandles[action.type](defaultState, { payload: action.payload });
        }
        return defaultState;
      };
      Object.keys(modalEffects).forEach(fname => {
        if (typeof modalEffects[fname] === 'function') {
          middleEffects[`${namespace}/${fname}`] = modalEffects[fname];
        }
      });
    });
  }
  if (Object.keys(reducers).length === 0) {
    reducers[staticNamespace] = () => {
      return {};
    };
  }
  const effects = function* everySaga() {
    for (const type in middleEffects) {
      yield takeEvery(type, middleEffects[type]);
    }
  };
  return { reducers, effects };
}