const assert = require('assert');
const redux = require('redux');
const createSagaMiddleware = require('redux-saga').default;
const { put } = require('redux-saga').effects;
const reduxHelps = require('../lib/redux-helps');

const { createStore, applyMiddleware, combineReducers } = redux;
const { transformModals } = reduxHelps;

describe('how to write \'transformModals\'', () => {
  it('correct \'modal\'', done => {
    const rootModal = {
      counter: {
        namespace: 'counter',
        state: {
          count: 1,
        },
        reducers: {
          multiply: (state, { payload }) => {
            state.count *= payload.times;
            return { ...state };
          }
        },
        sagas: {
          *asyncOperation({ payload }) {
            yield put({
              type: 'setState',
              payload: {
                count: payload.count
              }
            })
          }
        }
      }
    }
    const { reducers, sagas } = transformModals(rootModal);
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(combineReducers(reducers), applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(sagas);
    store.dispatch({ type: 'setState', payload: { count: 10 } })
    assert.equal(store.getState().counter.count, 10)
    store.dispatch({ type: 'multiply', payload: { times: 100 } })
    assert.equal(store.getState().counter.count, 1000)
    store.dispatch({ type: 'counter/asyncOperation', payload: { count: 10000 } });
    assert.equal(store.getState().counter.count, 10000)
    done();
  });
});