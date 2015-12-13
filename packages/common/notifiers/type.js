import BaseObject from 'common/object/base';
import CallbackNotifier from './callback';

class TypeNotifier extends BaseObject {
  constructor(type, notifier) {
    
    if (typeof notifier === 'function') {
      notifier = CallbackNotifier.create(notifier);
    }

    super({ type: type, notifier: notifier });
  }
  notify(message) {
    if (message.type !== this.type) return;
    return this.notifier.notify(message);
  }
}

export default TypeNotifier;
