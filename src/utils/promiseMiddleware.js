export default function (effects) {
  const middleEffects = effects._middleEffects;
  return () => next => action => {
    if (effects) {
      if (isEffect(middleEffects, action.type)) {
        // eslint-disable-next-line no-undef
        return new Promise((resolve, reject) => {
          next({
            _resolve: resolve,
            _reject: reject,
            ...action
          });
        });
      }
    }
    return next(action);
  };
}

function isEffect(middleEffects, type) {
  if (middleEffects[type]) {
    return true;
  }
  return false;
}