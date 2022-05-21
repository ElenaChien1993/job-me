export const execute = callback => {
  try {
    const res = callback();
    return [res, null];
  } catch (err) {
    return [null, err];
  }
};

export const executeAsync = async callback => {
  try {
    const res = await callback();
    return [res, null];
  } catch (err) {
    return [null, err];
  }
};

export const listenErrors = () => {
  console.log('listen')
  window.addEventListener('error', (e) => {
    console.log('onerror handler logging error', e);
  });

  // window.onerror = function (message, source, lineno, colno, error) {
  //   console.log('onerror handler logging error', message);
  //   return true;
  // };
  // window.onunhandledrejection = function (errorEvent) {
  //   console.log('onunhandledrejection handler logging error', errorEvent);
  //   return true;
  // };
};
