import { IVisibleEntity, IEntityDisplay, DisplayCapabilities } from "sf-core/entities";
import { BoundingRect } from "sf-core/geom";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";

class EntitySelectionDisplay implements IEntityDisplay {

  constructor(readonly selection: DisplayEntityCollection) { }

  get bounds() {
    return BoundingRect.merge(...this.selection.map((entity) => entity.display.bounds));
  }

  get capabilities() {
    return DisplayCapabilities.merge(...this.selection.map((entity) => entity.display.capabilities));
  }
}

export class DisplayEntityCollection extends Array<IVisibleEntity> {
  readonly display: IEntityDisplay = new EntitySelectionDisplay(this);
}

export const dependency = new SelectionFactoryDependency("display", DisplayEntityCollection);