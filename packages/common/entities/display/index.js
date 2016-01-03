import Entity from 'common/entities/base';
import { ChangeMessage } from 'base/message-types';

/**
 * an entity which gets displayed to the user
 */

class DisplayEntity extends Entity {

  constructor(properties, children) {
    super({ attributes: { style: {} }, ...properties }, children);
  }

  /**
   * visual style of display entity such as position & dimensions
   */

  setStyle(properties) {

    this.attributes.style = Object.assign(
      {},
      this.attributes.style || {},
      properties
    );

    // just remove it
    for (var key in properties) {
      var value = properties[key];
      if (value == void 0) {
        delete this.attributes.style[key];
      }
    }

    this.notifyChange();
  }

  /**
   */

  notifyChange() {
    // FIXME - kind of nasty code here - breaks abstraction of change emittion
    // via setProperties. This chunk should be re-evaluated later on - okay for now.
    if (this.notifier) {
      this.notifier.notify(ChangeMessage.create([
        { target: this }
      ]));
    }
  }

  /**
   * DEPRECATED - use get style() instead
   */

  getStyle() {
    return this.attributes.style;
  }

  /**
   */

  get style() {
    return this.getStyle();
  }
}

export default DisplayEntity;
