import Node from 'common/node';
import uuid from 'uuid';
import { ChangeMessage } from 'base/messages';


export class Entity extends Node {
  constructor(properties) {

    // entities are represented by other things, and so an ID is necessary
    // for quickly finding related objects
    super({ id: properties.id || uuid.v1(), ...properties});
  }
};

/**
 * an entity which gets displayed to the user
 */

export class DisplayEntity extends Entity {

  constructor(properties) {
    super({ attributes: { style: {} }, ...properties });
  }

  /**
   * returns the computed style of the display entity - dimensions and such. This is particularly decoupled from any rendering engine. This method should also be overridden
   */

  getComputedStyle() {
    throw new Error('display entity must be bound to view before a style can be computed');
  }

  /**
   * overrides the style computer. Should be set by renderer
   */

  setStyleComputer(fn) {
    this.getComputedStyle = fn;
  }

  /**
   * visual style of display entity such as position & dimensions
   */

  setStyle(properties) {
    this.attributes.style = Object.assign({}, this.attributes.style || {}, properties);
    if (this.notifier) this.notifier.notify(ChangeMessage.create([
      { target: this }
    ]));
  }
}
