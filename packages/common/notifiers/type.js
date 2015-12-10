import BaseObject from 'common/object/base';

class TypeNotifier extends BaseObject {
  constructor(type, notifier) {
    super({ type: type, notifier: notifier });
  }
  notify(message) {
    if (message.type !== this.type) return;
    return this.notifier.notify(message);
  }
}

export default TypeNotifier;
