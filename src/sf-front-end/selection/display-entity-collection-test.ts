import { IEntityDisplay, IVisibleEntity, DisplayCapabilities } from "sf-core/entities";
import { BoundingRect, IPosition } from "sf-core/geom";
import { Element } from "sf-core/markup";
import { DisplayEntityCollection } from "./display-entity-collection";
import { expect } from "chai";

describe(__filename + "#", () => {

  class MockDisplay implements IEntityDisplay {
    constructor(
      readonly bounds: BoundingRect,
      readonly capabilities: DisplayCapabilities = new DisplayCapabilities(true, true)
    ) {
    }

    movePosition(value: IPosition) { }
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
    new DisplayEntityCollection();
  });

  function _simplifyBounds(bounds: BoundingRect) {
    return [bounds.left, bounds.top, bounds.right, bounds.bottom];
  }

  it("computes the entire bounds of one entity", () => {
    const selection = new DisplayEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400)))
    );
    expect(_simplifyBounds(selection.display.bounds)).to.eql([100, 200, 300, 400]);
  });

  it("calculates the outer bounds for multiple entities in the collection", () => {
    const selection = new DisplayEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400))),
      new VisibleEntity(new MockDisplay(new BoundingRect(500, 600, 700, 800))),
      new VisibleEntity(new MockDisplay(new BoundingRect(900, 1000, 1100, 1200)))
    );
    expect(_simplifyBounds(selection.display.bounds)).to.eql([100, 200, 1100, 1200]);
  });

  it("returns the correct display capabilities for a single entity", () => {
    const selection = new DisplayEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(true, true)))
    );
    expect(selection.display.capabilities.movable).to.equal(true);
    expect(selection.display.capabilities.resizable).to.equal(true);
  });

  it("returns the correct display capabilities for multiple entities", () => {
    const selection = new DisplayEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(true, true))),
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(false, true)))
    );
    expect(selection.display.capabilities.movable).to.equal(false);
    expect(selection.display.capabilities.resizable).to.equal(true);

    selection.push(new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(false, false))));

    expect(selection.display.capabilities.resizable).to.equal(false);
  });
});