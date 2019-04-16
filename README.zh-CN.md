[English](./README.md) | 简体中文

# redux-helps

`redux-helps` 是一个工具方法集，在使用 `redux` 的情况下，可以简化 `redux` 的 `reducers` 聚合，或者在使用 `redux-saga` 的情况下，可以简化 `redux-saga` 的 `effects` 的聚合。并且 `reducers` 和 `effects` 可以联合使用。

## 开始

### 安装

```
npm install redux-helps --save
```

### 如何使用

提供 `reducer` 的转化方法，`transformReducer` 和 `transformReducers`。

提供 `effect` 的转化方法， `transformEffect` 和 `transformEffects`。

甚至提供了，`reducer` 和 `effect` 联合使用的转化方法 `transformModal`。

具体的使用，可以查看文件夹 `test` 和 `example`。

#### 如何快速引入

第一种方式: 使用 `webpack` 的 `require.context()` 方法。

```javascript
const context = require.context('./', false, /\.js$/);
export default context.keys().filter(item => item !== './index.js').map(key => context(key));
```

第二种方式：使用 `import` 和 `export defalut`。


### 新特性

现在如果你使用方法 `transformModal` ，你可以使用 `dispatch().then()`, 如果 `type` 是 `effects`， 可以返回一个 `promise`

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

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式和我们一起共建：

- 通过 Issue bug 或进行咨询。
- 提交 Pull Request 改进代码。
