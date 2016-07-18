import { Entity } from 'saffron-common/entities/entity';
import { FactoryFragment } from 'saffron-common/fragments';
 
export default class StyleEntity extends Entity {
  
} 

export default FactoryFragment.create({
  ns: 'entities/cssStyle',
  factory: StyleEntity
});