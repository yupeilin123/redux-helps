const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore } = redux;
const { transformReduce } = reduxHelps;

describe('how to write \'transformReduce\'', () => {
  it('correct \'state\'', done => {
    const rootReduce = {
      state: {
        count: 0
      }
    };
    const store = createStore(transformReduce(rootReduce));
    console.log(store.getState());
    const { count } = store.getState();
    assert.equal(count, 0);
    done();
  });
  it('default \'setState\'', done => {
    const rootReduce = {
      state: {
        count: 0
      }
    };
    const store = createStore(transformReduce(rootReduce));
    store.dispatch({
      type: 'setState', payload: {
        count: 1
      }
    });
    const { count } = store.getState();
    assert.equal(count, 1);
    done();
  });
});