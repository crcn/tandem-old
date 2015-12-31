import BaseObject from 'common/object/base';

/**
 * Computes the visual elements of a display entity
 */

class DisplayEntitiyComputer extends BaseObject {

  constructor(entity, displayObject) {
    super();
    this.entity        = entity;
    this.displayObject = displayObject;
  }

  getStyle() {
    throw new Error('getStyle must be overridden');
  }

  setBounds(bounds) {
    throw new Error('setBounds must be overridden');
  }
}

export default DisplayEntitiyComputer;
