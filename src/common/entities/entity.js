import Element from 'common/nodes/element';
import assertPropertyExists from 'common/utils/assert/property-exists';

export default class Entity extends Element {
  constructor(properties) {
    super(properties);
    assertPropertyExists(this, 'expression');
  }
}
