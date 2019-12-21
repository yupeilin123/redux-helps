# redux-helps

`redux-helps` 是一个工具方法集，在使用 `redux` 的情况下，可以简化 `redux` 的 `reducers` 聚合，或者在使用 `redux-saga` 的情况下，可以简化 `redux-saga` 的 `effects` 的聚合。并且 `reducers` 和 `effects` 可以联合使用。

## 开始

### 安装

```
npm install redux-helps --save
```

### 如何使用

使用 `transformModal`，得到一个 `reducer` 和 `effect` 。

### 新特性

使用了 `promiseMiddleware` 中间件，在 `action` 是 `effects` 时，就可以使用 `dispatch().then()`。

```javascript
const rootModal = {
  counter: {
    namespace: 'counter',
    effects: {
      *asyncResolve({ payload }) {
        yield delay(500)
        return payload
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
  consolg.log(res) // 10000
})
```

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式和我们一起共建：

- 通过 Issue bug 或进行咨询。
- 提交 Pull Request 改进代码。
