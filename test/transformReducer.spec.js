const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore } = redux;
const { transformReducer } = reduxHelps;

describe('how to write \'transformReducer\'', () => {
  it('correct \'state\'', done => {
    const rootReducer = {
      state: {
        count: 1
      }
    };
    const store = createStore(transformReducer(rootReducer));
    const { count } = store.getState();
    assert.equal(count, 1);
    done();
  });
  it('default \'setState\'', done => {
    const rootReducer = {
      state: {
        count: 1
      }
    };
    const store = createStore(transformReducer(rootReducer));
    store.dispatch({
      type: 'setState', payload: {
        count: 10
      }
    });
    const { count } = store.getState();
    assert.equal(count, 10);
    done();
  });
  it('new action \'multiply\'', done => {
    const rootReducer = {
      state: {
        count: 1
      },
      multiply: (state, { payload }) => {
        state.count *= payload.times;
        return { ...state };
      }
    };
    const store = createStore(transformReducer(rootReducer));
    store.dispatch({
      type: 'multiply', payload: {
        times: 10
      }
    });
    const { count } = store.getState();
    assert.equal(count, 10);
    done();
  })
});