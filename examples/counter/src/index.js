import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Counter from './Components/Counter.js';
import rootReducers from './Reducers';
import rootEffects from './Effects';
import { transformReducer, transformEffect } from 'redux-helps'
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(transformReducer(rootReducers), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(transformEffect(rootEffects))

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