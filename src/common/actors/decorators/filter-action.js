export default (filter) => (
  (proto, name, inf) => {
    var oldValue = inf.value;
    inf.value = function (action) {
      if (filter(action)) {
        return oldValue.call(this, action);
      }
    };
  }
);
