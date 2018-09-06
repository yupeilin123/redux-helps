const staticNamespace = 'reduxHelps@0.0.1#shift.Qew';

function filterFinalState(defaultState, changeState) {
  const finalState = { ...defaultState };
  for (const key in changeState) {
    if (Object.prototype.hasOwnProperty.call(finalState, key)) {
      finalState[key] = changeState[key];
    }
  }
  return finalState;
}

export default function transformReduces(rootReduce) {
  const reduces = {};
  if (Array.isArray(rootReduce)) {
    const len = rootReduce.length;
    for (let i = 0; i < len; i += 1) {
      if (rootReduce[i].default) {
        const { namespace, state, ...handles } = rootReduce[i].default;
        if (Object.prototype.hasOwnProperty.call(rootReduce[i].default, 'namespace')) {
          reduces[namespace] = (defaultState = { ...state }, action) => {
            if (action.type === 'setState') {
              return filterFinalState(defaultState, action.payload);
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
      if (namespace) {
        reduces[namespace] = (defaultState = { ...state }, action) => {
          if (action.type === 'setState') {
            return filterFinalState(defaultState, action.payload);
          }
          if (handles[action.type] && typeof handles[action.type] === 'function') {
            return handles[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
      } else {
        reduces[type] = (defaultState = { ...state }, action) => {
          if (action.type === 'setState') {
            return filterFinalState(defaultState, action.payload);
          }
          if (handles[action.type] && typeof handles[action.type] === 'function') {
            return handles[action.type](defaultState, { payload: action.payload });
          }
          return defaultState;
        };
      }
    });
  }
  if (Object.keys(reduces).length === 0) {
    reduces[staticNamespace] = () => {
      return {};
    };
  }
  return reduces;
}