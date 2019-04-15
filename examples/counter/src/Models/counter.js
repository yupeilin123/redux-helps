import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

export default {
  namespace: 'counter',
  state: {
    count: 0
  },
  effects: {
    *incrementIfOdd({ payload }) {
      if (payload.count % 2 === 1) {
        yield put({
          type: 'counter/setState', payload: {
            count: payload.count + 1
          }
        });
      }
    },
    *incrementAsync({ payload }) {
      yield call(delay, 1000);
      yield put({
        type: 'counter/setState', payload: {
          count: payload.count + 1
        }
      });
    }
  },
  reducers: {
    setState: (state, action) => {
      return { ...state, ...action.payload };
    },
  }
}