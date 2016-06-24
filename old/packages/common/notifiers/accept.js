import BaseObject from 'common/object/base';
import BaseNotifier from './base';
import NoopNotifier from './noop';

/**
 * Redirects a message depending on its properties
 */

class AcceptNotifier extends BaseNotifier {

  /**
   *  Constructor
   * @param {Function} filter filter function for each message
   * @param {BaseNotifier} yesNotifier notifier to use if filter returns TRUE
   * @param {BaseNotifier} noNotifier notifier to use if filter returns FALSE
   */

  constructor(filter, yesNotifier, noNotifier) {
    super();
    this.filter      = filter;
    this.yesNotifier = yesNotifier;
    this.noNotifier  = noNotifier || NoopNotifier.create();
  }

  /**
   * Passes message to 'yes' or 'no' notifier based on the filter boolean result on message
   * @param {BaseMessage} message notification message - redirected based on filter result
   * @returns {*} A result from the notifier
   */

  notify(message) {
    return this.filter(message) ? this.yesNotifier.notify(message) : this.noNotifier.notify(message);
  }
}

export default AcceptNotifier;
