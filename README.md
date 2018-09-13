English | [简历中文](./README.zh-CN.md)

# redux-helps

`redux-helps` is a set of methods. In the case of `redux` , can simplify the `reducers` aggregation of `redux` , or in case of `redux-saga` , it can also simplify the  aggregation of `redux-saga` 's `sagas` .

## Getting started

### Install
```
npm install redux-helps --save
```

### How to use

Now provide the single file `transform` methods,`transformReducer` 和 `transformSaga`。You can view `examples` and `test` in detail.

**transformReducers**

The method `transformReducers` is used to convert `redux` 's `reducers` .

First way: use the `require.context()` method of `webpack` .

Create a new `reduces` folder and create new `index.js` ,
```javascript
const context = require.context('./', false, /\.js$/);
export default context.keys().filter(item => item !== './index.js').map(key => context(key));
```
Create a new `counter.js` under `reduces` ,
```javascript
export default {
  namespace: 'counter',
  state: {
    count: 0
  }
}
```
Default action `setState` ,
```javascript
import { createStore, combineReducers } from 'redux';
import { transformReducers } from 'redux-helps';
import rootReduce from './reduces';

const reduces = combineReducers({ ...transformReducers(rootReduce) });
const store = createStore(reduces);
store.dispatch({ type: 'setState', payload: { count: 1 } });
const { counter } = store.getState();
console.log(counter.count); // 1
```
Need to add new `action` ,
```javascript
export default {
  namespace: 'counter',
  state: {
    count: 0
  },
  multiply: (state, { payload }) => {
    state.count = state.count * payload.times;
    return { ...state }
  },
}
```
Second way: use `import` and `export defalut` .

Create a new `index.js` under `reduces` ,
```javascript
import counter from 'counter';

export default {
  counter
}
```
Create a new `reduces` folder and create a new `counter.js` under `reduces`.
```javascript
export default {
  namespace: 'Counter',
  state: {
    count: 0
  }
}
```
You can also omit `namespace` , so there will be a default `namespace` whitch is the object property name expoerted by `reduces/index.js` .

**transformSagas**

The method `transformSagas` is used to convert the `sagas` of `redux-saga` .

This is used the same as `transformReducers` . The principle is use `takeEvery` to capture every `sagas` defined.

Here is an example of using the first way to method above:
Create a new `counter.js` under `sagas` ,

```javascript
import { put } from 'redux-saga/effects';

export default {
  *asyncOperation({ payload }) {
    yield put({
      type: 'setState',
      payload: {
        count: payload.count,
      },
    });
  },
};
```
`store.js`
```javascript
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { transformReducers, transformSagas } from 'redux-helps';
import rootReduce from './reduces';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const reduces = combineReducers({...transformReducers(rootReduce)});

const store = createStore(reduces, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(transformSagas(rootSaga));

store.dispatch({type: 'asyncOperation', payload: { count : 10}});
const { counter } = store.getState();
console.log(counter.count); // 10
```
You can also add the `namespace: Counter` in `counter` .

Then this way, `store.dispatch({type: 'Counter/asyncOperation, payload: {count : 10}})` .

## Contributing

Any type of contribution is welcome, here are some examples of how you may contribute to this project:

- Submit issues to report bugs or ask questions.
- Propose pull requests to improve our code。
