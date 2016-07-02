import BaseObject from 'common/object/base';
import BaseMessage from 'common/message-types/base';
import BaseCollection from 'common/collection';

/**
 * A collection of notifiers. Passes Message to each notifier when notify() is called
 * @extends BaseCollection
 * @extends BaseNotifier
 */

class NotifierCollection extends BaseCollection {

  /**
   *
   * @param message
   * @returns {Promise}
   */

  notify(message) {
    var promises = [];

    if (!(message instanceof BaseMessage)) {
      console.warn('"%s" must be a BaseMessage.', message.type);
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
