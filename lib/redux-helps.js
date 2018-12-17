'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var _objectWithoutProperties = _interopDefault(require('@babel/runtime/helpers/objectWithoutProperties'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var effects = require('redux-saga/effects');

function checkState(state) {
  return _typeof(state) === 'object' && state !== null;
}

/**
 * 
 * @param {object} rootReducer 
 * @return {function}
 */

function transformReducer(rootReducer) {
  var state = rootReducer.state,
      handles = _objectWithoutProperties(rootReducer, ["state"]);

  var plainState = state;

  if (plainState && !checkState(plainState)) {
    plainState = {};
  }

  var reducer = function reducer() {
    var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, plainState);
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (typeof handles[action.type] === 'function') {
      return handles[action.type](defaultState, {
        payload: action.payload
      });
    }

    return defaultState;
  };

  return reducer;
}

function checkNamespace(params) {
  return typeof params === 'string' && params.trim().length !== 0;
}

/**
 * 
 * @param {Object} handles 
 * @param {String} namespace 
 * @return {Object}
 */
function generateHandles(handles, namespace) {
  var finalHandles = {};

  for (var key in handles) {
    var actionName = namespace + '/' + key;
    finalHandles[actionName] = handles[key];
  }

  return finalHandles;
}

var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var staticNamespace = "redux-helps@1.0.0-".concat(randomString());
/**
 * 
 * @param {object | array} rootReducer 
 * @return {function}
 */

function transformReducers(rootReducer) {
  var reducers = {};

  if (Array.isArray(rootReducer)) {
    var len = rootReducer.length;

    for (var i = 0; i < len; i += 1) {
      if (rootReducer[i].default) {
        (function () {
          var _rootReducer$i$defaul = rootReducer[i].default,
              namespace = _rootReducer$i$defaul.namespace,
              state = _rootReducer$i$defaul.state,
              handles = _objectWithoutProperties(_rootReducer$i$defaul, ["namespace", "state"]);

          if (!checkNamespace(namespace)) {
            throw new Error('namespace must be \'String\' and it\'s not null');
          }

          var plainState = state;

          if (plainState && !checkState(plainState)) {
            plainState = {};
          }

          var finalHandles = generateHandles(handles, namespace);

          reducers[namespace] = function () {
            var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, plainState);
            var action = arguments.length > 1 ? arguments[1] : undefined;

            if (typeof finalHandles[action.type] === 'function') {
              return finalHandles[action.type](defaultState, {
                payload: action.payload
              });
            }

            return defaultState;
          };
        })();
      }
    }
  } else {
    Object.keys(rootReducer).forEach(function (type) {
      var _rootReducer$type = rootReducer[type],
          namespace = _rootReducer$type.namespace,
          state = _rootReducer$type.state,
          handles = _objectWithoutProperties(_rootReducer$type, ["namespace", "state"]);

      if (!checkNamespace(namespace)) {
        throw new Error('namespace must be \'String\' and it\'s not null');
      }

      var plainState = state;

      if (plainState && !checkState(plainState)) {
        plainState = {};
      }

      var finalHandles = generateHandles(handles, namespace);

      reducers[namespace] = function () {
        var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, plainState);
        var action = arguments.length > 1 ? arguments[1] : undefined;

        if (typeof finalHandles[action.type] === 'function') {
          return finalHandles[action.type](defaultState, {
            payload: action.payload
          });
        }

        return defaultState;
      };
    });
  }

  if (Object.keys(reducers).length === 0) {
    reducers[staticNamespace] = function () {
      return {};
    };
  }

  return reducers;
}

/**
 * 
 * @param {object} rootSaga 
 * @return {generator function}
 */

function transformEffect(rootSaga) {
  var sagas = {};
  Object.keys(rootSaga).forEach(function (fname) {
    if (typeof rootSaga[fname] === 'function') {
      sagas[fname] = rootSaga[fname];
    }
  });
  return (
    /*#__PURE__*/
    _regeneratorRuntime.mark(function everySagas() {
      var type;
      return _regeneratorRuntime.wrap(function everySagas$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = _regeneratorRuntime.keys(sagas);

            case 1:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 7;
                break;
              }

              type = _context.t1.value;
              _context.next = 5;
              return effects.takeEvery(type, sagas[type]);

            case 5:
              _context.next = 1;
              break;

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, everySagas, this);
    })
  );
}

/**
 * 
 * @param {object | array} rootSaga 
 * @return {generator function}
 */

function transformEffects(rootSaga) {
  var sagas = {};

  if (Array.isArray(rootSaga)) {
    var len = rootSaga.length;

    for (var i = 0; i < len; i += 1) {
      if (rootSaga[i].default) {
        if (Object.prototype.hasOwnProperty.call(rootSaga[i].default, 'namespace')) {
          (function () {
            var _rootSaga$i$default = rootSaga[i].default,
                namespace = _rootSaga$i$default.namespace,
                handles = _objectWithoutProperties(_rootSaga$i$default, ["namespace"]);

            if (!checkNamespace(namespace)) {
              throw new Error('namespace must be \'String\' and it\'s not null');
            }

            Object.keys(handles).forEach(function (fname) {
              if (typeof handles[fname] === 'function') {
                sagas["".concat(namespace, "/").concat(fname)] = handles[fname];
              }
            });
          })();
        } else {
          throw new Error('namespace muse be \'String\' ');
        }
      }
    }
  } else {
    Object.keys(rootSaga).forEach(function (type) {
      var subSaga = rootSaga[type];

      if (Object.prototype.hasOwnProperty.call(subSaga, 'namespace')) {
        var namespace = subSaga.namespace,
            handles = _objectWithoutProperties(subSaga, ["namespace"]);

        if (!checkNamespace(namespace)) {
          throw new Error('namespace must be \'String\' and it\'s not null');
        }

        Object.keys(handles).forEach(function (fname) {
          if (typeof handles[fname] === 'function') {
            sagas["".concat(namespace, "/").concat(fname)] = handles[fname];
          }
        });
      } else {
        throw new Error('namespace muse be \'String\' ');
      }
    });
  }

  return (
    /*#__PURE__*/
    _regeneratorRuntime.mark(function everySagas() {
      var type;
      return _regeneratorRuntime.wrap(function everySagas$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = _regeneratorRuntime.keys(sagas);

            case 1:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 7;
                break;
              }

              type = _context.t1.value;
              _context.next = 5;
              return effects.takeEvery(type, sagas[type]);

            case 5:
              _context.next = 1;
              break;

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, everySagas, this);
    })
  );
}

var randomString$1 = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var staticNamespace$1 = "reduxHelps@1.0.0.".concat(randomString$1());
/**
 * 
 * @param {object | array} rootModal 
 * @return {object<reducers>}
 * @return {generator function<sagas>}
 */

function transformModals(rootModal) {
  var reducers = {};
  var middleEffects = {};

  if (Array.isArray(rootModal)) {
    var len = rootModal.length;

    for (var i = 0; i < len; i += 1) {
      if (rootModal[i].default) {
        (function () {
          var _rootModal$i$default = rootModal[i].default,
              namespace = _rootModal$i$default.namespace,
              state = _rootModal$i$default.state,
              modalReducers = _rootModal$i$default.reducers,
              modalEffects = _rootModal$i$default.sagas;

          if (!checkNamespace(namespace)) {
            throw new Error('namespace\'s type must be a \'String\'');
          }

          var plainState = state;

          if (plainState && !checkState(plainState)) {
            plainState = {};
          }

          var finalHandles = generateHandles(modalReducers, namespace);

          reducers[namespace] = function () {
            var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, plainState);
            var action = arguments.length > 1 ? arguments[1] : undefined;

            if (finalHandles[action.type] === 'function') {
              return finalHandles[action.type](defaultState, {
                payload: action.payload
              });
            }

            return defaultState;
          };

          Object.keys(modalEffects).forEach(function (fname) {
            if (typeof modalEffects[fname] === 'function') {
              middleEffects["".concat(namespace, "/").concat(fname)] = modalEffects[fname];
            }
          });
        })();
      }
    }
  } else {
    Object.keys(rootModal).forEach(function (type) {
      var _rootModal$type = rootModal[type],
          namespace = _rootModal$type.namespace,
          state = _rootModal$type.state,
          modalReducers = _rootModal$type.reducers,
          modalEffects = _rootModal$type.effects;

      if (!checkNamespace(namespace)) {
        throw new Error('namespace must be \'String\' and it\'s not null');
      }

      var plainState = state;

      if (plainState && !checkState(plainState)) {
        plainState = {};
      }

      var finalHandles = generateHandles(modalReducers, namespace);

      reducers[namespace] = function () {
        var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, plainState);
        var action = arguments.length > 1 ? arguments[1] : undefined;

        if (typeof finalHandles[action.type] === 'function') {
          return finalHandles[action.type](defaultState, {
            payload: action.payload
          });
        }

        return defaultState;
      };

      Object.keys(modalEffects).forEach(function (fname) {
        if (typeof modalEffects[fname] === 'function') {
          middleEffects["".concat(namespace, "/").concat(fname)] = modalEffects[fname];
        }
      });
    });
  }

  if (Object.keys(reducers).length === 0) {
    reducers[staticNamespace$1] = function () {
      return {};
    };
  }

  var effects$$1 =
  /*#__PURE__*/
  _regeneratorRuntime.mark(function everySaga() {
    var type;
    return _regeneratorRuntime.wrap(function everySaga$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = _regeneratorRuntime.keys(middleEffects);

          case 1:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 7;
              break;
            }

            type = _context.t1.value;
            _context.next = 5;
            return effects.takeEvery(type, middleEffects[type]);

          case 5:
            _context.next = 1;
            break;

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, everySaga, this);
  });

  return {
    reducers: reducers,
    effects: effects$$1
  };
}

var index = {
  transformReducer: transformReducer,
  transformReducers: transformReducers,
  transformEffect: transformEffect,
  transformEffects: transformEffects,
  transformModal: transformModals
};

module.exports = index;
