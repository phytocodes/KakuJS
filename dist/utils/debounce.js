function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
}
export {
  debounce
};
