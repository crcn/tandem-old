import BaseObject from 'object';

class CallbackNotifier extends BaseObject {
  constructor(notify) {
    super({ notify: notify });
  }
}

export default CallbackNotifier;
