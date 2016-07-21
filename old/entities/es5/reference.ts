import Entity from 'saffron-front-end/src/entities/base';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import get from 'saffron-common/src/utils/object/get';
import {  } from '../parsers/expressions'; 

export default class ReferenceEntity extends Entity {
  public  value:any;
  public expression:any;
  async load(options) {
    this.value = get(options.context || {}, this.expression.path.join('.'));
  }
}

export const fragment = new ClassFactoryFragment('entities/reference', ReferenceEntity);