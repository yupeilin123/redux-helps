const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore, combineReducers } = redux;
const { transformReduces } = reduxHelps;

describe('how to write action ?', () => {
  it('default setState', done => {
    const rootReduce = {
      counter: {
        state: {
          count: 0,
        },
      },
      list: {},
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    store.dispatch({
      type: 'setState',
      payload: {
        count: 1,
      },
    });
    const { counter } = store.getState();
    assert.equal(counter.count, 1);
    done();
  });
  it('extra action', done => {
    const rootReduce = {
      counter: {
        state: {
          count: 1,
        },
        multiply: (state, { payload }) => {
          state.count *= payload.times;
          return { ...state };
        },
      },
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    store.dispatch({
      type: 'multiply',
      payload: {
        times: 10,
      },
    });
    const { counter } = store.getState();
    assert.equal(counter.count, 10);
    done();
  });
});