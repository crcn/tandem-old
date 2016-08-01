import { IEntityDisplay, IVisibleEntity } from "sf-core/entities";
import { BoundingRect } from "sf-core/geom";
import { Element } from "sf-core/markup";
import { VisibleEntityCollection } from "./display-entity-collection";
import { expect } from "chai";

describe(__filename + "#", () => {

  class MockDisplay implements IEntityDisplay {
    constructor(readonly bounds: BoundingRect) {
    }
  }

  class VisibleEntity extends Element implements IVisibleEntity {
    readonly type: string = "display";
    readonly expression: any = null;
    constructor(readonly display: IEntityDisplay) {
      super("entity");
    }
    render() { return null; }
  }

  it("can be created", () => {
    new VisibleEntityCollection();
  });

  function _simplifyBounds(bounds: BoundingRect) {
    return [bounds.left, bounds.top, bounds.right, bounds.bottom];
  }

  it("computes the entire bounds of one entity", () => {
    const selection = new VisibleEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400)))
    );
    expect(_simplifyBounds(selection.display.bounds)).to.eql([100, 200, 300, 400]);
  });

  it("calculates the outer bounds for multiple entities in the collection", () => {
    const selection = new VisibleEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400))),
      new VisibleEntity(new MockDisplay(new BoundingRect(500, 600, 700, 800))),
      new VisibleEntity(new MockDisplay(new BoundingRect(900, 1000, 1100, 1200)))
    );
    expect(_simplifyBounds(selection.display.bounds)).to.eql([100, 200, 1100, 1200]);
  });
});