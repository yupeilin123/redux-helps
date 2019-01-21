const assert = require('assert');
const redux = require('redux');
const createSagaMiddleware = require('redux-saga').default;
const { put } = require('redux-saga/effects');
const reduxHelps = require('../lib/redux-helps');

const { createStore, applyMiddleware } = redux;
const { transformEffects } = reduxHelps;

describe('how to write \'transformEffects\'', () => {
  it('corrent \'saga\'', done => {
    const rootReduce = (state = { count: 1024 }, action) => {
      switch (action.type) {
        case 'setState':
          return { ...state, ...action.payload }
        default:
          return state;
      }
    };
    const rootSaga = {
      count: {
        namespace: 'counter',
        *asyncOperation({ payload }) {
          yield put({
            type: 'setState',
            payload: {
              count: payload.count
            }
          })
        }
      }
    };
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReduce, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(transformEffects(rootSaga));
    store.dispatch({ type: 'counter/asyncOperation', payload: { count: 10 } });
    const { count } = store.getState();
    assert.equal(count, 10);
    done();
  });
});