const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore } = redux;
const { transformReducer } = reduxHelps;

describe('how to write \'transformReducer\'', () => {
  it('correct \'state\'', done => {
    const rootReducer = {
      state: {
        count: 0
      }
    };
    const store = createStore(transformReducer(rootReducer));
    const { count } = store.getState();
    assert.equal(count, 0);
    done();
  });
  it('default \'setState\'', done => {
    const rootReducer = {
      state: {
        count: 0
      }
    };
    const store = createStore(transformReducer(rootReducer));
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