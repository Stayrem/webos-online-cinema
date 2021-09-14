export const keyDict = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  ENTER: 'Enter',
};

export  const fetchStatusesDict = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  ERROR: 'ERROR',
}

export const keyPressHandler = (evt, callback) => {
  const key = evt.key;
  callback(key);
}