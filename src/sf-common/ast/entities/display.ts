import { IPoint } from "sf-common/geom";
import { BoundingRect } from "sf-common/geom";

// TODO - possibly move this over to sf-common/display or similar
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
  position: IPoint;
  visible: boolean;
}