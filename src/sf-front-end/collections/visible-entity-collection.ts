import { BoundingRect, IPoint } from "sf-core/geom";
import { register as registerSerializer, serializeArray, deserialize } from "sf-core/serialize";
import { IVisibleEntity, IEntityDisplay, DisplayCapabilities, IEntity } from "sf-core/ast/entities";

class EntitySelectionDisplay implements IEntityDisplay {

  readonly visible: boolean = true;

  constructor(readonly selection: VisibleEntityCollection<IVisibleEntity>) { }

  get position(): IPoint {
    const bounds = this.bounds;
    return { left: bounds.left, top: bounds.top };
  }

  set position(position: IPoint) {
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

export class VisibleEntityCollection<T extends IVisibleEntity> extends Array<T> {
  readonly display: IEntityDisplay = new EntitySelectionDisplay(this);
  constructor(...entities: Array<IEntity>) {
    super(...(<Array<T>>entities).filter((entity: IVisibleEntity) => entity.display));
  }

}
