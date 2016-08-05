import { IVisibleEntity, IEntityDisplay, DisplayCapabilities } from "sf-core/entities";
import { BoundingRect, IPosition } from "sf-core/geom";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";

class EntitySelectionDisplay implements IEntityDisplay {

  constructor(readonly selection: DisplayEntityCollection) { }

  movePosition(position: IPosition) {
    for (const item of this.selection) {
      item.display.movePosition(position);
    }
  }

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