import { ISynthetic } from "@tandem/sandbox";
import { BoundingRect, IPoint } from "@tandem/common";
import {
  MarkupNodeType,
  BaseSyntheticDOMNodeEntity,
  BaseVisibleSyntheticDOMNodeEntity,
  ISyntheticDOMCapabilities,
} from "@tandem/synthetic-browser";

// class EntitySelectionDisplay implements IEntityDisplay {

//   readonly visible: boolean = true;

//   constructor(readonly selection: VisibleDOMEntityCollection<IVisibleEntity>) { }

//   get position(): IPoint {
//     const bounds = this.bounds;
//     return { left: bounds.left, top: bounds.top };
//   }

//   set position(position: IPoint) {
//     const epos = this.position;
//     for (const item of this.selection) {
//       const itemDisplay = item.display;
//       const itemBounds  = itemDisplay.bounds;
//       itemDisplay.position = {
//         left: position.left + (itemBounds.left - epos.left),
//         top : position.top  + (itemBounds.top  - epos.top)
//       };
//     }
//   }



//   set bounds(nbounds: BoundingRect) {

//     const cbounds = this.bounds;
//     for (const item of this.selection) {
//       const itemDisplay = item.display;
//       const ibounds     = itemDisplay.bounds;

//       const percLeft   = (ibounds.left - cbounds.left) / cbounds.width;
//       const percTop    = (ibounds.top  - cbounds.top)  / cbounds.height;
//       const percWidth  = ibounds.width / cbounds.width;
//       const percHeight = ibounds.height / cbounds.height;

//       const left   = nbounds.left + nbounds.width * percLeft;
//       const top    = nbounds.top  + nbounds.height * percTop;
//       const right  = left + nbounds.width * percWidth;
//       const bottom = top + nbounds.height * percHeight;

//       itemDisplay.bounds = new BoundingRect(
//         left,
//         top,
//         right,
//         bottom
//       );
//     }
//   }

//   get capabilities() {
//     return DisplayCapabilities.merge(...this.selection.map((entity) => entity.display.capabilities));
//   }
// }

export class VisibleDOMEntityCollection<T extends BaseVisibleSyntheticDOMNodeEntity<any, any>> extends Array<T> {

  constructor(...components: BaseSyntheticDOMNodeEntity<any, any>[]) {
    super(...(<Array<T>><any>components).filter((entity: BaseVisibleSyntheticDOMNodeEntity<any, any>) => entity instanceof BaseVisibleSyntheticDOMNodeEntity));
  }

  get absoluteBounds() {
    return BoundingRect.merge(...this.map((entity) => entity.absoluteBounds));
  }

  get position(): IPoint {
    const bounds = this.absoluteBounds;
    return { left: bounds.left, top: bounds.top };
  }

  set position(position: IPoint) {
    const epos = this.position;
    for (const item of this) {
      const itemBounds  = item.absoluteBounds;
      item.position = {
        left: position.left + (itemBounds.left - epos.left),
        top : position.top  + (itemBounds.top  - epos.top)
      };
    }
  }

  set absoluteBounds(nbounds: BoundingRect) {

    const cbounds = this.absoluteBounds;
    for (const item of this) {
      const ibounds     = item.absoluteBounds;

      const percLeft   = (ibounds.left - cbounds.left) / cbounds.width;
      const percTop    = (ibounds.top  - cbounds.top)  / cbounds.height;
      const percWidth  = ibounds.width / cbounds.width;
      const percHeight = ibounds.height / cbounds.height;

      const left   = nbounds.left + nbounds.width * percLeft;
      const top    = nbounds.top  + nbounds.height * percTop;
      const right  = left + nbounds.width * percWidth;
      const bottom = top + nbounds.height * percHeight;

      item.absoluteBounds = new BoundingRect(
        left,
        top,
        right,
        bottom
      );
    }
  }

  get capabilities(): ISyntheticDOMCapabilities {
    const capabilities = { movable: true, resizable: true };
    for (const item of this) {
      const cap = item.capabilities;
      for (const key in cap) {
        capabilities[key] = capabilities[key] && cap[key];
      }
    }
    return capabilities;
  }

}
