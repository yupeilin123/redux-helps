import checkState from './utils/checkState';

export default function transformReducer(rootReducer) {
  const { state, ...handles } = rootReducer;
  let plainState = state;
  if (plainState && !checkState(plainState)) {
    plainState = {};
  }
  const reducer = (defaultState = { ...plainState }, action) => {
    if (action.type === 'setState') {
      return { ...defaultState, ...action.payload };
    }
    if (handles[action.type] && typeof handles[action.type] === 'function') {
      return handles[action.type](defaultState, { payload: action.payload });
    }
    return defaultState;
  };
  return reducer;
}