import Entity from 'saffron-common/lib/entities/entity';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';
 
export default class StyleEntity extends Entity {
  
} 

export const fragment = new FactoryFragment({
  ns: 'entities/cssStyle',
  factory: StyleEntity
});