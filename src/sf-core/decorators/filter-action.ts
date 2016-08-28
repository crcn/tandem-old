/**
 * Used for actors that need to filter for particular actions. Usage:
 *
 * @filterAction(sift({ $type: DSAction }))
 * update(action:UpdateAction) { }
 */

export default (filter: Function) => (
  (proto, name, inf) => {
    const oldValue = inf.value;
    inf.value = function (action) {
      if (filter(action)) {
        return oldValue.call(this, action);
      }
    };
  }
);
