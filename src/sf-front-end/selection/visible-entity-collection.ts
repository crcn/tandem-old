import { IVisibleEntity } from "sf-core/entities";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";

export class VisibleEntityCollection extends Array<IVisibleEntity> {
  constructor(...items: Array<IVisibleEntity>) {
    super(...items);
  }

  static test(entity) {
    return entity["display"] != null;
  }
}

export const dependency = new SelectionFactoryDependency("display", VisibleEntityCollection);