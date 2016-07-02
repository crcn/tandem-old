import assert from 'assert';
import BaseNotifier from './base';
import CallbackNotifier from './callback';

/**
 * redirects messages to notifier based on the message type
 */

class TypeNotifier extends BaseNotifier {

  /**
   *
   * @param {String} type the type of message to accept
   * @param {BaseNotifier} notifier the notifier to pass messages to when the message type matches
   */

  constructor(type, notifier) {
    
    if (typeof notifier === 'function') {
      notifier = CallbackNotifier.create(notifier);
    }

    assert(type, 'type must exist');
    assert(notifier, 'notifier must exist');

    super({ type: type, notifier: notifier });
  }

  notify(message) {
    if (message.type !== this.type) return;
    return this.notifier.notify(message);
  }
}

export default TypeNotifier;
