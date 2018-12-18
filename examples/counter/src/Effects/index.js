import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

export default {
  *incrementIfOdd({ payload }) {
    if (payload.count % 2 === 1) {
      yield put({
        type: 'setState', payload: {
          count: payload.count + 1
        }
      });
    }
  },
  *incrementAsync({ payload }) {
    yield call(delay, 1000);
    yield put({
      type: 'setState', payload: {
        count: payload.count + 1
      }
    });
  }
};