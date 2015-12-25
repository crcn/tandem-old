import BaseCollection from 'common/collection';
import BaseObject from 'common/object/base';

class NotifierCollection extends BaseCollection {
  notify(message) {
    var promises = [];

    if (!(message instanceof BaseObject)) {
      console.warn('"%s" notifier message is a POJO. It\'s safer to instantiate a pre-defined Message class instead', message.type);
    }

    for (var observer of this) {
      promises.push(observer.notify(message));
    }

    // TODO - don't do this - return message object instead. The message
    // should have a resolve() or reject() handlers
    return Promise.all(promises);
  }
}

export default NotifierCollection;
