const assert = require('assert');
const redux = require('redux');
const createSagaMiddleware = require('redux-saga').default;
const { put } = require('redux-saga').effects;
const reduxHelps = require('../lib/redux-helps');

const { createStore, applyMiddleware } = redux;
const { transformSagas } = reduxHelps;

describe('how to write \'transformSaga\'', () => {
  it('corrent \'saga\'', done => {
    const rootReduce = (state = { count: 10 }, action) => {
      switch (action.type) {
        case 'setState':
          return { ...state, ...action.payload }
        default:
          return state;
      }
    };
    const rootSaga = {
      count: {
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
    sagaMiddleware.run(transformSagas(rootSaga));
    store.dispatch({ type: 'asyncOperation', payload: { count: 10 } });
    const { count } = store.getState();
    assert.equal(count, 10);
    done();
  });
  it('with namespace\'s \'saga\'', done => {
    const rootReduce = (state = { count: 10 }, action) => {
      switch (action.type) {
        case 'setState':
          return { ...state, ...action.payload }
        default:
          return state;
      }
    };
    const rootSaga = {
      count: {
        namespace: 'Count',
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
    sagaMiddleware.run(transformSagas(rootSaga));
    store.dispatch({ type: 'Count/asyncOperation', payload: { count: 10 } });
    const { count } = store.getState();
    assert.equal(count, 10);
    done();
  })
});