import BaseObject from 'object-base';

class CallbackNotifier extends BaseObject {
  constructor(notify) {
    super({ notify: notify });
  }
}

export default CallbackNotifier;
