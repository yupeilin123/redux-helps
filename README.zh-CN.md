[English](./README.md) | 简体中文

# redux-helps

`redux-helps` 是一个工具方法集，在使用 `redux` 的情况下，可以简化 `redux` 的 `reduces` 聚合，或者在使用 `redux-saga` 的情况下，可以简化 `redux-saga` 的 `sagas` 的聚合。

## 开始

### 安装
```
npm install redux-helps --save
```

### 如何使用

**transformReduces**

方法 `transformReduces` 用来转化 `redux` 的 `reduces` 。

第一种方式: 使用 `webpack` 的 `require.context()` 方法。

新建 `reduces` 文件夹，并新建 `index.js` ，
```javascript
const context = require.context('./', false, /\.js$/);
export default context.keys().filter(item => item !== './index.js').map(key => context(key));
```
在 `reduces` 下新建 `counter.js` 文件，
```javascript
export default {
  namespace: 'counter',
  state: {
    count: 0
  }
}
```
默认 `setState` action，
```javascript
import { createStore, combineReducers } from 'redux';
import { transformReduces } from 'redux-helps';
import rootReduce from './reduces';

const reduces = combineReducers({ ...transformReduces(rootReduce) });
const store = createStore(reduces);
store.dispatch({ type: 'setState', payload: { count: 1 } });
const { counter } = store.getState();
console.log(counter.count); // 1
```
需要添加 new`action` ，
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
第二种方式：使用 `import` 和 `export defalut `

在 `reduces` 下新建 `index.js` 文件，
```javascript
import counter from 'counter';

export default {
  counter
}
```
新建 `reduces` 文件夹，并在 `reduces` 下新建 `counter.js` 文件，
```javascript
export default {
  namespace: 'Counter',
  state: {
    count: 0
  }
}
```
也可以不写 `namespace` ，那么会有一个默认的 `namespace` 是 `reduces/index.js` 导出的对象属性名。

**transformSagas**

方法 `transformSagas` 用来转化 `redux-saga `的 `sagas`。
使用的方式与 `transformReduces` 大致相同。原理是使用 `takeEvery` ，能捕获到定义的每个 `saga` 。
在这里使用上文的第一种方式举例：
在 `sagas` 下新建 `counter.js` ,

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
import { transformReduces, transformSagas } from 'redux-helps';
import rootReduce from './reduces';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const reduces = combineReducers({...transformReduces(rootReduce)});

const store = createStore(reduces, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(transformSagas(rootSaga));

store.dispatch({type: 'asyncOperation', payload: { count : 10}});
const { counter } = store.getState();
console.log(counter.count); // 10
```
也可以在 `counter.js` 中增加 `namespace: Counter` 属性，

那么这样， `store.dispatch({type: 'Counter/asyncOperation, payload: {count : 10}})` 。

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式和我们一起共建：

- 通过 Issue bug 或进行咨询。
- 提交 Pull Request 改进代码。
