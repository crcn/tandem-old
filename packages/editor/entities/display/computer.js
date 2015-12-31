import BaseObject from 'common/object/base';

/**
 * Computes the visual elements of a display entity
 */

class DisplayEntityComputer extends BaseObject {

  /**
   * constructor
   * @param {Entity} entity
   * @param {React.Component} displayObject
   */

  constructor(entity, displayObject) {
    super();
    this.entity        = entity;
    this.displayObject = displayObject;
  }

  /**
   * returns the computed style
   * @abstract
   */

  getStyle() {
    throw new Error('getStyle must be overridden');
  }
}

export default DisplayEntityComputer;
