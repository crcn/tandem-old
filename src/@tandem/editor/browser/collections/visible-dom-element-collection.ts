import { BoundingRect, IPoint } from "@tandem/common";
import {
  DOMNodeType,
  SyntheticHTMLElement,
  VisibleSyntheticDOMElement,
  VisibleDOMNodeCapabilities,
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

export class VisibleSyntheticElementCollection<T extends VisibleSyntheticDOMElement<any>> extends Array<T> {

  constructor(...elements: any[]) {
    super(

      // dirty check - might be better to use reflection here instead to check
      // for visible interface.
      ...elements.filter(element => element["getCapabilities"])
    );
  }

  get editable() {
    return this.find((entity) => entity.source == null) == null;
  }

  getAbsoluteBounds(): BoundingRect {
    return BoundingRect.merge(...this.map(element => element.getAbsoluteBounds()));
  }

  setPosition(position: IPoint) {
    const epos = this.getAbsoluteBounds();
    for (const element of this) {
      const elementBounds  = element.getAbsoluteBounds();
      element.setAbsolutePosition({
        left: position.left + (elementBounds.left - epos.left),
        top : position.top  + (elementBounds.top  - epos.top)
      });
    }
  }

  setAbsoluteBounds(nbounds: BoundingRect) {

    const cbounds = this.getAbsoluteBounds();

    for (const item of this) {
      const ibounds     = item.getAbsoluteBounds();

      const percLeft   = (ibounds.left - cbounds.left) / cbounds.width;
      const percTop    = (ibounds.top  - cbounds.top)  / cbounds.height;
      const percWidth  = ibounds.width / cbounds.width;
      const percHeight = ibounds.height / cbounds.height;

      const left   = nbounds.left + nbounds.width * percLeft;
      const top    = nbounds.top  + nbounds.height * percTop;
      const right  = left + nbounds.width * percWidth;
      const bottom = top + nbounds.height * percHeight;

      item.setAbsoluteBounds(new BoundingRect(left, top, right, bottom));
    }
  }

  getCapabilities(): VisibleDOMNodeCapabilities {
    const allCapabilities = [new VisibleDOMNodeCapabilities(true, true)];
    return VisibleDOMNodeCapabilities.merge(...this.map((element) => element.getCapabilities()));
  }

  async save() {
    for (const entity of this) {
      // await entity.save();
    }
  }
}
