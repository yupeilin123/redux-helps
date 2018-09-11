import checkState from './utils/checkState';

export default function transformReduce(rootReduce) {
  const { state, ...handles } = rootReduce;
  let plainState = state;
  if (plainState && !checkState(plainState)) {
    plainState = {};
  }
  const reduce = (defaultState = { ...plainState }, action) => {
    if (action.type === 'setState') {
      return { ...defaultState, ...action.payload };
    }
    if (handles[action.type] && typeof handles[action.type] === 'function') {
      return handles[action.type](defaultState, { payload: action.payload });
    }
    return defaultState;
  };
  return reduce;
}