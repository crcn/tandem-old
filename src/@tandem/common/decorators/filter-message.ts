/**
 * Used for actors that need to filter for particular actions. Usage:
 *
 * @filterMessage(sift({ $type: DSEvent }))
 * update(action:UpdateEvent) { }
 */

export function filterMessage (filter: Function) {
  return (proto, name, inf) => {
    const oldValue = inf.value;
    inf.value = function (message) {
      if (filter(message)) {
        return oldValue.call(this, message);
      }
    };
  }
};
