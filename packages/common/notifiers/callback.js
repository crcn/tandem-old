import BaseObject from 'common/object/base';
import BaseNotifier from './base';

class CallbackNotifier extends BaseNotifier {

  /**
   *
   * @param {Function} callback the callback function to pass the Message to when notify() is called
   */

  constructor(callback) {
    super();
    this._callback = callback;
  }

  notify(message) {
    return this._callback(message);
  }
}

export default CallbackNotifier;
