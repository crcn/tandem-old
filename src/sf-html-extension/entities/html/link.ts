import { GroupNodeSection } from "sf-core/markup/section";
import { HTMLElementEntity } from "./element";
import { EntityFactoryDependency } from "sf-core/dependencies";

// TODO
export class LinkEntity extends HTMLElementEntity {
  createSection() {
    return new GroupNodeSection();
  }
}


export const linkEntityDependency  = new EntityFactoryDependency("link", LinkEntity);

