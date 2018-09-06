const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore, combineReducers } = redux;
const { transformReduces } = reduxHelps;

describe('whether namespace exists ?', () => {
  it('it is exit', done => {
    const rootReduce = {
      counter: {
        namespace: 'Counter',
      },
      list: {},
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    const { Counter } = store.getState();
    assert.ok(Counter);
    done();
  });
  it('it is not exit', done => {
    const rootReduce = {
      counter: {},
      list: {},
    };
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    const { counter } = store.getState();
    assert.ok(counter);
    done();
  });
});