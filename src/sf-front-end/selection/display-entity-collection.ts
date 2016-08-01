import { IVisibleEntity, IEntityDisplay } from "sf-core/entities";
import { BoundingRect } from "sf-core/geom";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";

class EntitySelectionDisplay implements IEntityDisplay {

  constructor(readonly selection: VisibleEntityCollection) { }

  get bounds() {
    return BoundingRect.merge(...this.selection.map((entity) => entity.display.bounds));
  }
}

export class VisibleEntityCollection extends Array<IVisibleEntity> {
  readonly display: EntitySelectionDisplay = new EntitySelectionDisplay(this);
}

export const dependency = new SelectionFactoryDependency("display", VisibleEntityCollection);