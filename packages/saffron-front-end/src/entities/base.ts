import Element from 'saffron-front-end/src/nodes/element';
import assertPropertyExists from 'saffron-common/src/utils/assert/property-exists';
import IEntity from './interface';

export default class Entity<ExpressionType> extends Element {

  public expression:ExpressionType;
  public bus:any;
  
  constructor(properties) {
    super(properties);
  }

  update(options:any) {

  }

  load(options:any) {

  }
}
