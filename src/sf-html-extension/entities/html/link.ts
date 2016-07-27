import { HTMLElementEntity } from './base';
import { EntityFactoryFragment } from 'sf-core/fragments';
import { GroupNodeSection } from 'sf-core/markup/section';

// TODO
export class LinkEntity extends HTMLElementEntity {
  createSection() {
    return new GroupNodeSection();
  }
}


export const linkEntityFragment  = new EntityFactoryFragment('link', LinkEntity);

