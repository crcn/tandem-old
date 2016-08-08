import { IVisibleEntity, IEntityDisplay, DisplayCapabilities } from "sf-core/entities";
import { BoundingRect, IPosition } from "sf-core/geom";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";

class EntitySelectionDisplay implements IEntityDisplay {

  constructor(readonly selection: DisplayEntityCollection) { }

  movePosition(position: IPosition) {
    const bounds = this.bounds;
    for (const item of this.selection) {
      const itemDisplay = item.display;
      const itemBounds  = itemDisplay.bounds;
      itemDisplay.movePosition({
        left: position.left + (itemBounds.left - bounds.left),
        top : position.top  + (itemBounds.top  - bounds.top)
      });
    }
  }

  get bounds() {
    return BoundingRect.merge(...this.selection.map((entity) => entity.display.bounds));
  }

  set bounds(value: BoundingRect) {
    for (const item of this.selection) {
      item.display.bounds = value;
    }
  }

  get capabilities() {
    return DisplayCapabilities.merge(...this.selection.map((entity) => entity.display.capabilities));
  }
}

export class DisplayEntityCollection extends Array<IVisibleEntity> {
  readonly display: IEntityDisplay = new EntitySelectionDisplay(this);
}

export const dependency = new SelectionFactoryDependency("display", DisplayEntityCollection);