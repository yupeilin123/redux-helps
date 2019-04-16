const assert = require('assert');
const redux = require('redux');
const createSagaMiddleware = require('redux-saga').default;
const { put, delay } = require('redux-saga/effects');
const reduxHelps = require('../lib/redux-helps');

const { createStore, applyMiddleware, combineReducers } = redux;
const { transformModal, promiseMiddleware } = reduxHelps;

describe('how to write \'transformModal\'', () => {
  it('correct \'modal\'', done => {
    const rootModal = {
      counter: {
        namespace: 'counter',
        state: {
          count: 1024,
        },
        reducers: {
          setState: (state, { payload }) => {
            state.count = payload.count;
            return { ...state };
          }
        },
        effects: {
          *asyncOperation({ payload }) {
            yield put({
              type: 'counter/setState',
              payload: {
                count: payload.count
              }
            })
          },
          *asyncResolve({ payload, resolve }) {
            resolve(payload)
          }
        }
      }
    }
    const { reducers, effects } = transformModal(rootModal);
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(combineReducers(reducers), applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(effects);
    store.dispatch({ type: 'counter/setState', payload: { count: 10 } })
    assert.equal(store.getState().counter.count, 10)
    store.dispatch({ type: 'counter/asyncOperation', payload: { count: 10000 } });
    assert.equal(store.getState().counter.count, 10000)
    done();
  });
  it('correct user \'resolve\'', done => {
    const rootModal = {
      counter: {
        namespace: 'counter',
        state: {
          count: 1
        },
        reducers: {},
        effects: {
          *asyncResolve({ payload, resolve }) {
            yield delay(500)
            resolve(payload)
          }
        }
      }
    }
    const { reducers, effects } = transformModal(rootModal);
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(combineReducers(reducers), applyMiddleware(promiseMiddleware(effects), sagaMiddleware));
    sagaMiddleware.run(effects);
    store.dispatch({ type: 'counter/asyncResolve', payload: 10000 }).then(res => {
      assert.equal(res, 10000)
      done()
    })
  })
});