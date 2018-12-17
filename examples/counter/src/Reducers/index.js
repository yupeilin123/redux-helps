export default {
  state: {
    count: 0
  },
  setState: (state, action) => {
    return { ...state, ...action.payload };
  }
};