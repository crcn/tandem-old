import Node from 'common/node';
import uuid from 'uuid';
import { ChangeMessage } from 'base/messages';
import { clone } from 'common/utils/object';
import assert from 'assert';

export function deserialize(data, rootProps, plugins) {
  var entityPlugin = plugins.queryOne({
    id: data.props.pluginId
  });

  var entity = entityPlugin.factory.create({ ...data.props, ...rootProps }, data.children.map(function(childData) {
    return deserialize(childData, {}, plugins);
  }));

  return entity;
};

export class Entity extends Node {

  constructor(properties, children) {

    assert(properties.pluginId, 'Plugin id must exist');

    // entities are represented by other things, and so an ID is necessary
    // for quickly finding related objects
    super({
      pluginId: properties.pluginId,
      id: properties.id || uuid.v1(),
      ...properties
    }, children);
  }

  serialize() {

    var data = {
      children: this.children.map(function(child) {
        return child.serialize();
      }),
      props: {}
    };

    // might break, but simple enough. Should work
    // for most cases.
    for (var key in this) {
      var value = this[key];
      if (key === 'parent' || key === 'notifier' || typeof value === 'function' || key.charAt(0) === '_') continue;
      data.props[key] = clone(value);
    }

    return data;
  }
};

/**
 * an entity which gets displayed to the user
 */

export class DisplayEntity extends Entity {

  constructor(properties, children) {
    super({ attributes: { style: {} }, ...properties }, children);
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

  /**
   */

  getStyle() {
    return this.attributes.style;
  }
}
