const assert = require('assert');
const redux = require('redux');
const reduxHelps = require('../lib/redux-helps');

const { createStore, combineReducers } = redux;
const { transformReduces } = reduxHelps;

describe('whether reduces exists ?', () => {
  it('every reduce is null', done => {
    const rootReduce = {};
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces);
    assert.strictEqual(Object.keys(store.getState).length, 0);
    assert.strictEqual(Object.keys(store.getState())[0], 'reduxHelps@0.0.1#shift.Qew');
    done();
  });
});