import Element from '../nodes/element';
import assertPropertyExists from '../utils/assert/property-exists';

export default class Entity extends Element {
  constructor(properties) {
    super(properties);
    assertPropertyExists(this, 'expression');
  }

  update() {

  }

  load() {

  }
}
