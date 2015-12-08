import BaseObject from 'common/object/base';
import NoopNotifier from './noop';

class AcceptNotifier extends BaseObject {

  constructor(filter, yesNotifier, noNotifier) {
    super();
    this.filter = filter;
    this.yesNotifier = yesNotifier;
    this.noNotifier = noNotifier || NoopNotifier.create();
  }

  notify(message) {
    return this.filter(message) ? this.yesNotifier.notify(message) : this.noNotifier.notify(message);
  }
}

export default AcceptNotifier;
