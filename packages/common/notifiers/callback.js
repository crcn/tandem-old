import BaseObject from 'common/object/base';

class CallbackNotifier extends BaseObject {
  constructor(notify) {
    super({ notify: notify });
  }
}

export default CallbackNotifier;
