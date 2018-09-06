const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore, combineReducers } = redux;
const { transformReduces } = reduxHelps;

describe('how to write correct reduces ?', () => {
  it('it is incorrect', done => {
    const rootReduce = {
      counter: {
        count: 0,
      },
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    const { counter } = store.getState();
    assert.equal(counter.count, undefined);
    done();
  });
  it('it is correct', done => {
    const rootReduce = {
      counter: {
        state: {
          count: 0,
        },
      },
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    const { counter } = store.getState();
    assert.equal(counter.count, 0);
    done();
  });
});