(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@babel/runtime/helpers/objectWithoutProperties'), require('@babel/runtime/helpers/objectSpread'), require('@babel/runtime/regenerator'), require('redux-saga/effects')) :
typeof define === 'function' && define.amd ? define(['@babel/runtime/helpers/objectWithoutProperties', '@babel/runtime/helpers/objectSpread', '@babel/runtime/regenerator', 'redux-saga/effects'], factory) :
(global['redux-helper'] = factory(global._objectWithoutProperties,global._objectSpread,global._regeneratorRuntime,global.effects));
}(this, (function (_objectWithoutProperties,_objectSpread,_regeneratorRuntime,effects) { 'use strict';

_objectWithoutProperties = _objectWithoutProperties && _objectWithoutProperties.hasOwnProperty('default') ? _objectWithoutProperties['default'] : _objectWithoutProperties;
_objectSpread = _objectSpread && _objectSpread.hasOwnProperty('default') ? _objectSpread['default'] : _objectSpread;
_regeneratorRuntime = _regeneratorRuntime && _regeneratorRuntime.hasOwnProperty('default') ? _regeneratorRuntime['default'] : _regeneratorRuntime;

var staticNamespace = 'reduxHelps@0.0.1#shift.Qew';

function filterFinalState(defaultState, changeState) {
  var finalState = _objectSpread({}, defaultState);

  for (var key in changeState) {
    if (Object.prototype.hasOwnProperty.call(finalState, key)) {
      finalState[key] = changeState[key];
    }
  }

  return finalState;
}

function transformReduces(rootReduce) {
  var reduces = {};

  if (Array.isArray(rootReduce)) {
    var len = rootReduce.length;

    for (var i = 0; i < len; i += 1) {
      if (rootReduce[i].default) {
        (function () {
          var _rootReduce$i$default = rootReduce[i].default,
              namespace = _rootReduce$i$default.namespace,
              state = _rootReduce$i$default.state,
              handles = _objectWithoutProperties(_rootReduce$i$default, ["namespace", "state"]);

          if (Object.prototype.hasOwnProperty.call(rootReduce[i].default, 'namespace')) {
            reduces[namespace] = function () {
              var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, state);
              var action = arguments.length > 1 ? arguments[1] : undefined;

              if (action.type === 'setState') {
                return filterFinalState(defaultState, action.payload);
              }

              if (handles[action.type] && typeof handles[action.type] === 'function') {
                return handles[action.type](defaultState, {
                  payload: action.payload
                });
              }

              return defaultState;
            };
          }
        })();
      }
    }
  } else {
    Object.keys(rootReduce).forEach(function (type) {
      var _rootReduce$type = rootReduce[type],
          namespace = _rootReduce$type.namespace,
          state = _rootReduce$type.state,
          handles = _objectWithoutProperties(_rootReduce$type, ["namespace", "state"]);

      if (namespace) {
        reduces[namespace] = function () {
          var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, state);
          var action = arguments.length > 1 ? arguments[1] : undefined;

          if (action.type === 'setState') {
            return filterFinalState(defaultState, action.payload);
          }

          if (handles[action.type] && typeof handles[action.type] === 'function') {
            return handles[action.type](defaultState, {
              payload: action.payload
            });
          }

          return defaultState;
        };
      } else {
        reduces[type] = function () {
          var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _objectSpread({}, state);
          var action = arguments.length > 1 ? arguments[1] : undefined;

          if (action.type === 'setState') {
            return filterFinalState(defaultState, action.payload);
          }

          if (handles[action.type] && typeof handles[action.type] === 'function') {
            return handles[action.type](defaultState, {
              payload: action.payload
            });
          }

          return defaultState;
        };
      }
    });
  }

  if (Object.keys(reduces).length === 0) {
    reduces[staticNamespace] = function () {
      return {};
    };
  }

  return reduces;
}

function transformSagas(rootSaga) {
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

            Object.keys(handles).forEach(function (fname) {
              sagas["".concat(namespace, "/").concat(fname)] = handles[fname];
            });
          })();
        } else {
          (function () {
            var handles = rootSaga[i].default;
            Object.keys(handles).forEach(function (fname) {
              sagas[fname] = handles[fname];
            });
          })();
        }
      }
    }
  } else {
    Object.keys(rootSaga).forEach(function (type) {
      var subSaga = rootSaga[type];

      if (Object.prototype.hasOwnProperty.call(subSaga, 'namespace')) {
        var namespace = subSaga.namespace,
            handles = _objectWithoutProperties(subSaga, ["namespace"]);

        Object.keys(handles).forEach(function (fname) {
          sagas["".concat(namespace, "/").concat(fname)] = handles[fname];
        });
      } else {
        Object.keys(subSaga).forEach(function (fname) {
          sagas[fname] = subSaga[fname];
        });
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
                _context.next = 8;
                break;
              }

              type = _context.t1.value;

              if (!sagas[type]) {
                _context.next = 6;
                break;
              }

              _context.next = 6;
              return effects.takeEvery(type, sagas[type]);

            case 6:
              _context.next = 1;
              break;

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, everySagas, this);
    })
  );
}

var index = {
  transformReduces: transformReduces,
  transformSagas: transformSagas
};

return index;

})));
