import BaseNotifier from './base';

/**
 * Notification handler which doesn't do anything with messages
 */

class NoopNotifier extends BaseNotifier {

  /**
   * no-operation
   */

  notify() { }
}

export default NoopNotifier;
