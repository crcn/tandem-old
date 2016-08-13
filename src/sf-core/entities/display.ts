import { IPosition } from "../geom";
import { BoundingRect } from "../geom";

// TODO - possibly move this over to sf-core/display or similar
export class DisplayCapabilities {
  constructor(
    readonly movable: boolean,
    readonly resizable: boolean
  ) {

  }

  merge(...capabilities: Array<DisplayCapabilities>) {
    return DisplayCapabilities.merge(this, ...capabilities);
  }

  static merge(...capabilities: Array<DisplayCapabilities>) {
    return capabilities.reduce((a, b) => (
      new DisplayCapabilities(
        a ? a.movable   && b.movable   : b.movable,
        b ? a.resizable && b.resizable : b.resizable
      )
    ));
  }
}

/**
 */

export interface IEntityDisplay {
  bounds: BoundingRect;
  capabilities: DisplayCapabilities;
  position: IPosition;
}