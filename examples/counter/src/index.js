import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Counter from './Components/Counter.js';
import { transformModal } from 'redux-helps'
import models from './Models';
import './index.css';
import * as serviceWorker from './serviceWorker';

const { reducers, effects } = transformModal(models)

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({ ...reducers }), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(effects)


function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}

ReactDOM.render(App(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();