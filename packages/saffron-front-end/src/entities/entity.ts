import Element from 'saffron-front-end/src/nodes/element';
import assertPropertyExists from 'saffron-common/src/utils/assert/property-exists';

export default class Entity extends Element {

  public expression:any;
  public bus:any;
  
  constructor(properties) {
    super(properties);
    assertPropertyExists(this, 'expression');
  }

  update(options:any) {

  }

  load(options:any) {

  }
}
