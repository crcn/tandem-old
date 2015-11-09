
class Entity {

  /**
   */

  constructor(properties) {
    this.setProperties(properties);
  }

  /**
   */

  setProperties(properties) {
    Object.assign(this, properties);
    this.update();
  }

  /**
   * updates the entity if any properties change
   */

  update() {
    // override me
  }
}

export default Entity;
