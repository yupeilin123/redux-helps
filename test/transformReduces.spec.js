const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore, combineReducers } = redux;
const { transformReduces } = reduxHelps;

describe('how to write \'transformReduces\'', () => {
  it('correct \'state\'', done => {
    const rootReduce = {
      counter: {
        state: {
          count: 0
        }
      }
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    const { counter } = store.getState();
    assert.equal(counter.count, 0);
    done();
  });
  it('\'namespace\' exit', done => {
    const rootReduce = {
      todo: {
        namespace: 'Todo'
      }
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    const { Todo } = store.getState();
    assert.ok(Todo);
    done();
  });
  it('\'namespace\' not exit', done => {
    const rootReduce = {
      todo: {}
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    const { todo } = store.getState();
    assert.ok(todo);
    done();
  });
  it('default \'setState\'', done => {
    const rootReduce = {
      counter: {
        state: {
          count: 0
        }
      }
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    store.dispatch({
      type: 'setState', payload: {
        count: 1
      }
    });
    const { counter } = store.getState();
    assert.equal(counter.count, 1);
    done();
  });
  it('new action \'multiply\'', done => {
    const rootReduce = {
      counter: {
        state: {
          count: 1,
        },
        multiply: (state, { payload }) => {
          state.count *= payload.times;
          return { ...state };
        }
      }
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
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