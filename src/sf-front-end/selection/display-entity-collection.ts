import { IVisibleEntity, IEntityDisplay, DisplayCapabilities } from "sf-core/entities";
import { BoundingRect, IPosition } from "sf-core/geom";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";
import { register as registerSerializer, serializeArray, deserialize } from "sf-core/serialize";
import { Selection } from "./base";

class EntitySelectionDisplay implements IEntityDisplay {

  constructor(readonly selection: DisplayEntityCollection) { }

  get position(): IPosition {
    const bounds = this.bounds;
    return { left: bounds.left, top: bounds.top };
  }

  set position(position: IPosition) {
    const epos = this.position;
    for (const item of this.selection) {
      const itemDisplay = item.display;
      const itemBounds  = itemDisplay.bounds;
      itemDisplay.position = {
        left: position.left + (itemBounds.left - epos.left),
        top : position.top  + (itemBounds.top  - epos.top)
      };
    }
  }

  get bounds() {
    return BoundingRect.merge(...this.selection.map((entity) => entity.display.bounds));
  }

  set bounds(nbounds: BoundingRect) {

    const cbounds = this.bounds;
    for (const item of this.selection) {
      const itemDisplay = item.display;
      const ibounds     = itemDisplay.bounds;

      const percLeft   = (ibounds.left - cbounds.left) / cbounds.width;
      const percTop    = (ibounds.top  - cbounds.top)  / cbounds.height;
      const percWidth  = ibounds.width / cbounds.width;
      const percHeight = ibounds.height / cbounds.height;

      const left   = nbounds.left + nbounds.width * percLeft;
      const top    = nbounds.top  + nbounds.height * percTop;
      const right  = left + nbounds.width * percWidth;
      const bottom = top + nbounds.height * percHeight;

      itemDisplay.bounds = new BoundingRect(
        left,
        top,
        right,
        bottom
      );
    }
  }

  get capabilities() {
    return DisplayCapabilities.merge(...this.selection.map((entity) => entity.display.capabilities));
  }
}

export class DisplayEntityCollection extends Selection<IVisibleEntity> {
  readonly display: IEntityDisplay = new EntitySelectionDisplay(this);
}

registerSerializer(DisplayEntityCollection, {
  serialize: serializeArray,
  deserialize: function(value) {
    return new DisplayEntityCollection(...value.map((item) => deserialize(item)));
  }
});

export const dependency = new SelectionFactoryDependency("display", DisplayEntityCollection);