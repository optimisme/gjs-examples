// export only what should be exported
const {
  clearInterval,
  clearTimeout,
  setInterval,
  setTimeout
} = (function (Mainloop) {
  function clear() {
    return (id) => Mainloop.source_remove(id);
  }
  function set(repeat) {    // spec compliant
    return function (fn, ms /*, ...args*/) {
      const args = [];
      for (let i = 2; i < arguments.length; i++) {
        args[i - 2] = arguments[i];
      }
      return Mainloop.timeout_add((ms * 1) || 0, () => {
        fn.apply(null, args);
        return repeat; // repeat or not the interval
      });
    };
  }
  // the destructured exported object
  return {
    clearInterval: clear(),
    clearTimeout: clear(),
    setInterval: set(true),
    setTimeout: set(false)
  };
}(imports.mainloop));
