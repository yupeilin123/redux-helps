const assert = require('assert');
const redux = require('redux');
const createSagaMiddleware = require('redux-saga').default;
const { put } = require('redux-saga').effects;
const reduxHelps = require('../lib/redux-helps');

const { createStore, combineReducers, applyMiddleware } = redux;
const { transformReduces, transformSagas } = reduxHelps;


describe('how to write sagas ?', () => {
  it('a counter saga', done => {
    const rootReduce = {
      counter: {
        state: {
          count: 0,
        },
      },
    };
    const rootSaga = {
      counter: {
        *asyncOperation({ payload }) {
          yield put({
            type: 'setState',
            payload: {
              count: payload.count,
            },
          });
        },
      },
    };
    const sagaMiddleware = createSagaMiddleware();
    const reduces = combineReducers({ ...transformReduces(rootReduce) });
    const store = createStore(reduces, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(transformSagas(rootSaga));
    store.dispatch({ type: 'asyncOperation', payload: { count: 10 } });
    const { counter } = store.getState();
    assert.equal(counter.count, 10);
    done();
  });
});