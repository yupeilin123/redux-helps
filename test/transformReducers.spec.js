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
    const reducers = combineReducers(transformReducers(rootReducer));
    const store = createStore(reducers);
    const { counter } = store.getState();
    assert.equal(counter.count, 1);
    done();
  });
  it('new action \'stateState\'', done => {
    const rootReducer = {
      counter: {
        namespace: 'counter',
        state: {
          count: 1024,
        },
        setState: (state, { payload }) => {
          state.count = payload.count;
          return { ...state };
        }
      }
    };
    const reducers = combineReducers(transformReducers(rootReducer));
    const store = createStore(reducers);
    store.dispatch({
      type: 'counter/setState',
      payload: {
        count: 0,
      }
    });
    const { counter } = store.getState();
    assert.equal(counter.count, 0);
    done();
  });
});