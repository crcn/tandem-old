import { HTMLElementEntity } from './base';
import { EntityFactoryDependency } from 'sf-core/dependencies';
import { GroupNodeSection } from 'sf-core/markup/section';

// TODO
export class LinkEntity extends HTMLElementEntity {
  createSection() {
    return new GroupNodeSection();
  }
}


export const linkEntityDependency  = new EntityFactoryDependency('link', LinkEntity);

