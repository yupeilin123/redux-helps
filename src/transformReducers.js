import checkNamespace from './utils/checkNamespace';
import checkState from './utils/checkState';
const randomString = () => Math.random().toString(36).substring(7).split('').join('.');

const staticNamespace = `redux-helps@1.0.0-${randomString()}`;

/**
 * 
 * @param {object | array} rootReducer 
 * @return {function}
 */
export default function transformReducers(rootReducer) {
  const reducers = {};
  if (Array.isArray(rootReducer)) {
    const len = rootReducer.length;
    for (let i = 0; i < len; i += 1) {
      if (rootReducer[i].default) {
        const { namespace, state, ...handles } = rootReducer[i].default;
        if (!checkNamespace(namespace)) {
          throw new Error('namespace must be \'String\' and it\'s not null');
        }
        let plainState = state;
        if (plainState && !checkState(plainState)) {
          plainState = {};
        }
        const finalHandles = generateFinalHandle(handles, namespace);
        reducers[namespace] = (defaultState = { ...plainState }, action) => {
          if (typeof finalHandles[action.type] === 'function') {
            return finalHandles[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
      }
    }
  } else {
    Object.keys(rootReducer).forEach(type => {
      const { namespace, state, ...handles } = rootReducer[type];
      if (!checkNamespace(namespace)) {
        throw new Error('namespace must be \'String\' and it\'s not null');
      }
      let plainState = state;
      if (plainState && !checkState(plainState)) {
        plainState = {};
      }
      const finalHandles = generateFinalHandle(handles, namespace);
      reducers[namespace] = (defaultState = { ...plainState }, action) => {
        if (typeof finalHandles[action.type] === 'function') {
          return finalHandles[action.type](defaultState, { payload: action.payload });
        }
        return defaultState;
      };
    });
  }
  if (Object.keys(reducers).length === 0) {
    reducers[staticNamespace] = () => {
      return {};
    };
  }
  return reducers;
}
/**
 * 
 * @param {Object} handles 
 * @param {String} namespace 
 * @return {Object}
 */
function generateFinalHandle(handles, namespace) {
  const finalHandles = {};
  for (const key in handles) {
    const actionName = namespace + '/' + key;
    finalHandles[actionName] = handles[key];
  }
  return finalHandles;
}