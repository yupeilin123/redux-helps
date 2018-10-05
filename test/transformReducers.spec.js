const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore, combineReducers } = redux;
const { transformReducers } = reduxHelps;

describe('how to write \'transformReducers\'', () => {
  it('correct \'state\'', done => {
    const rootReducer = {
      counter: {
        namespace: 'counter',
        state: {
          count: 1
        }
      }
    };
    const reducers = combineReducers({ ...transformReducers(rootReducer) });
    const store = createStore(reducers);
    const { counter } = store.getState();
    assert.equal(counter.count, 1);
    done();
  });
  it('default \'setState\'', done => {
    const rootReducer = {
      counter: {
        namespace: 'counter',
        state: {
          count: 1
        }
      }
    };
    const reducers = combineReducers({ ...transformReducers(rootReducer) });
    const store = createStore(reducers);
    store.dispatch({
      type: 'setState', payload: {
        count: 10
      }
    });
    const { counter } = store.getState();
    assert.equal(counter.count, 10);
    done();
  });
  it('new action \'multiply\'', done => {
    const rootReducer = {
      counter: {
        namespace: 'counter',
        state: {
          count: 1,
        },
        multiply: (state, { payload }) => {
          state.count *= payload.times;
          return { ...state };
        }
      }
    };
    const reducers = combineReducers({ ...transformReducers(rootReducer) });
    const store = createStore(reducers);
    store.dispatch({
      type: 'multiply',
      payload: {
        times: 10,
      }
    });
    const { counter } = store.getState();
    assert.equal(counter.count, 10);
    done();
  });
});