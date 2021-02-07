export const runSerial = tasks => {
  let result = Promise.resolve();
  tasks.forEach(task => {
    result = result.then(() => task());
  });
  return result;
};
