import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Counter from './Components/Counter.js';
import rootReduces from './Reduces';
import rootSagas from './Sagas';
import { transformReduce, transformSaga } from 'redux-helps'
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(transformReduce(rootReduces), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(transformSaga(rootSagas));

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}

ReactDOM.render(App(), document.getElementById('root'));
registerServiceWorker();
