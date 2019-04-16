English | [简体中文](./README.zh-CN.md)

# redux-helps

`redux-helps` is a set of methods. In the case of `redux` , can simplify the `reducers` aggregation of `redux` , or in case of `redux-saga` , it can also simplify the  aggregation of `redux-saga` 's `effects` .

## Getting started

### Install
```
npm install redux-helps --save
```

### How to use

Provide `reducer` conversion methods, `transformReducer` and `transformReducers`.

Provide conversion methods for `effect`, `transformEffect` and `transformEffects`.

Even the conversion method `transformModal` used in conjunction with `reducers` and `effects` is provided.

For specific use, you can view the folders `test` and `example`.

#### how to introduce quickly

First way: use the `require.context()` method of `webpack`.

```javascript
const context = require.context('./', false, /\.js$/);
export default context.keys().filter(item => item !== './index.js').map(key => context(key));
```

Second way: use `import` and `export defalut`.

### New features

now if you use method `transformModal` , you can use `dispatch().then()` because if type is `effects` , it returns a `Promise`

```javascript
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
// need promiseMiddleware(effects)
const store = createStore(combineReducers(reducers), applyMiddleware(promiseMiddleware(effects), sagaMiddleware));
sagaMiddleware.run(effects);
store.dispatch({ type: 'counter/asyncResolve', payload: 10000 }).then(res => {
  consolg.log(res)
})
```

## Contributing

Any type of contribution is welcome, here are some examples of how you may contribute to this project:

- Submit issues to report bugs or ask questions.
- Propose pull requests to improve our code。
