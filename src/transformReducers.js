import checkNamespace from './utils/checkNamespace';
import checkState from './utils/checkState';
const randomString = () => Math.random().toString(36).substring(7).split('').join('.');

const staticNamespace = `reduxHelps@0.1.0.${randomString()}`;

export default function transformReducers(rootReducer) {
  const reducers = {};
  if (Array.isArray(rootReducer)) {
    const len = rootReducer.length;
    for (let i = 0; i < len; i += 1) {
      if (rootReducer[i].default) {
        if (Object.prototype.hasOwnProperty.call(rootReducer[i].default, 'namespace')) {
          const { namespace, state, ...handles } = rootReducer[i].default;
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
            if (handles[action.type] && typeof handles[action.type] === 'function') {
              return handles[action.type](defaultState, { payload: action.payload });
            }
            return defaultState;
          };
        }
      }
    }
  } else {
    Object.keys(rootReducer).forEach(type => {
      const { namespace, state, ...handles } = rootReducer[type];
      let plainState = state;
      if (plainState && !checkState(plainState)) {
        plainState = {};
      }
      if (namespace) {
        if (!checkNamespace(namespace)) {
          throw new Error('namespace\'s type must be a \'String\'');
        }
        reducers[namespace] = (defaultState = { ...plainState }, action) => {
          if (action.type === 'setState') {
            return { ...defaultState, ...action.payload };
          }
          if (handles[action.type] && typeof handles[action.type] === 'function') {
            return handles[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
      } else {
        reducers[type] = (defaultState = { ...plainState }, action) => {
          if (action.type === 'setState') {
            return { ...defaultState, ...action.payload };
          }
          if (handles[action.type] && typeof handles[action.type] === 'function') {
            return handles[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
      }
    });
    if (Object.keys(reducers).length === 0) {
      reducers[staticNamespace] = () => {
        return {};
      };
    }
  }
  return reducers;
}