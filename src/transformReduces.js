import checkNamespace from './utils/checkNamespace';
import checkState from './utils/checkState';
const randomString = () => Math.random().toString(36).substring(7).split('').join('.');

const staticNamespace = `reduxHelps@0.1.0.${randomString()}`;

export default function transformReduces(rootReduce) {
  const reduces = {};
  if (Array.isArray(rootReduce)) {
    const len = rootReduce.length;
    for (let i = 0; i < len; i += 1) {
      if (rootReduce[i].default) {
        if (Object.prototype.hasOwnProperty.call(rootReduce[i].default, 'namespace')) {
          const { namespace, state, ...handles } = rootReduce[i].default;
          if (!checkNamespace(namespace)) {
            throw new Error('namespace\'s type must be a \'String\'');
          }
          let plainState = state;
          if (plainState && !checkState(plainState)) {
            plainState = {};
          }
          reduces[namespace] = (defaultState = { ...plainState }, action) => {
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
    Object.keys(rootReduce).forEach(type => {
      const { namespace, state, ...handles } = rootReduce[type];
      let plainState = state;
      if (plainState && !checkState(plainState)) {
        plainState = {};
      }
      if (namespace) {
        if (!checkNamespace(namespace)) {
          throw new Error('namespace\'s type must be a \'String\'');
        }
        reduces[namespace] = (defaultState = { ...plainState }, action) => {
          if (action.type === 'setState') {
            return { ...defaultState, ...action.payload };
          }
          if (handles[action.type] && typeof handles[action.type] === 'function') {
            return handles[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
      } else {
        reduces[type] = (defaultState = { ...plainState }, action) => {
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
    if (Object.keys(reduces).length === 0) {
      reduces[staticNamespace] = () => {
        return {};
      };
    }
  }
  return reduces;
}