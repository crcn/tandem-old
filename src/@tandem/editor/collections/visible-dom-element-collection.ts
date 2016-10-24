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
      ...elements.filter(element => element["capabilities"])
    );
  }

  get editable() {
    return this.find((entity) => entity.source == null) == null;
  }

  getEagerAbsoluteBounds(): BoundingRect {
    return BoundingRect.merge(...this.map(element => element.getAbsoluteBounds()));
  }

  async getAbsoluteBounds(): Promise<BoundingRect> {
    return BoundingRect.merge(...(await Promise.all(this.map(async (element) => element.getAbsoluteBounds()))));
  }

  async setPosition(position: IPoint): Promise<any> {
    const epos = await this.getAbsoluteBounds();
    return Promise.all(this.map(async (element) => {
      const elementBounds  = await element.getAbsoluteBounds();
      await element.setAbsolutePosition({
        left: position.left + (elementBounds.left - epos.left),
        top : position.top  + (elementBounds.top  - epos.top)
      });
    }));
  }

  async setAbsoluteBounds(nbounds: BoundingRect): Promise<any> {

    const cbounds = await this.getAbsoluteBounds();

    for (const item of this) {
      const ibounds     = await item.getAbsoluteBounds();

      const percLeft   = (ibounds.left - cbounds.left) / cbounds.width;
      const percTop    = (ibounds.top  - cbounds.top)  / cbounds.height;
      const percWidth  = ibounds.width / cbounds.width;
      const percHeight = ibounds.height / cbounds.height;

      const left   = nbounds.left + nbounds.width * percLeft;
      const top    = nbounds.top  + nbounds.height * percTop;
      const right  = left + nbounds.width * percWidth;
      const bottom = top + nbounds.height * percHeight;

      // item.absoluteBounds = new BoundingRect(
      //   left,
      //   top,
      //   right,
      //   bottom
      // );
    }
  }

  getEagetCapabilities(): VisibleDOMNodeCapabilities {
    const allCapabilities = [new VisibleDOMNodeCapabilities(true, true)];
    return VisibleDOMNodeCapabilities.merge(...this.map((element) => element.getCapabilities()));
  }

  async getCapabilities(): Promise<VisibleDOMNodeCapabilities> {
    const allCapabilities = [new VisibleDOMNodeCapabilities(true, true)];
    for (const element of this) {
      allCapabilities.push(await element.getCapabilities());
    }

    return VisibleDOMNodeCapabilities.merge(...allCapabilities);
  }

  async save() {
    for (const entity of this) {
      // await entity.save();
    }
  }
}
