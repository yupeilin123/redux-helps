export default function (effects) {
  const middleEffects = effects._middleEffects;
  return () => next => action => {
    if (effects) {
      if (isEffect(middleEffects, action.type)) {
        // eslint-disable-next-line no-undef
        return new Promise((resolve, reject) => {
          return next({
            resolve: resolve,
            reject: reject,
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