import Element from 'sf-front-end/nodes/element';
import assertPropertyExists from 'sf-common/utils/assert/property-exists';
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
