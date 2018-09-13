import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Counter from './Components/Counter.js';
import rootReducers from './Reducers';
import rootSagas from './Sagas';
import { transformReducer, transformSaga } from 'redux-helps'
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(transformReducer(rootReducers), applyMiddleware(sagaMiddleware));
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
