import { expect } from "chai";
import { TreeNode } from "sf-core/tree";
import { BoundingRect, IPoint } from "sf-core/geom";
import { VisibleEntityCollection } from "./visible-entity-collection";
import { IEntity, IEntityDisplay, IVisibleEntity, DisplayCapabilities, EntityMetadata, BaseEntity, IExpression } from "sf-core/ast";

describe(__filename + "#", () => {

  class MockDisplay implements IEntityDisplay {
    constructor(
      public bounds: BoundingRect,
      readonly capabilities: DisplayCapabilities = new DisplayCapabilities(true, true)
    ) {
    }

    readonly visible: boolean = true;

    get position() {
      const bounds = this.bounds;
      return { left: bounds.left, top: bounds.top };
    }

    set position({ left, top }: IPoint) {
      this.bounds = new BoundingRect(left, top, left + this.bounds.width, top + this.bounds.height);
    }
  }

  class MockExpression extends TreeNode<MockExpression> implements IExpression {
    position = null;
    type = null;
  }


  class VisibleEntity extends BaseEntity<MockExpression> implements IVisibleEntity {

    readonly type: string = "display";
    readonly displayType: string = "element";

    constructor(readonly display: IEntityDisplay) {
      super(new MockExpression());
    }

    cloneLeaf() {
      return new VisibleEntity(this.display);
    }
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

  it("returns the correct display capabilities for a single entity", () => {
    const selection = new VisibleEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(true, true)))
    );
    expect(selection.display.capabilities.movable).to.equal(true);
    expect(selection.display.capabilities.resizable).to.equal(true);
  });

  it("returns the correct display capabilities for multiple entities", () => {
    const selection = new VisibleEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(true, true))),
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(false, true)))
    );
    expect(selection.display.capabilities.movable).to.equal(false);
    expect(selection.display.capabilities.resizable).to.equal(true);

    selection.push(new VisibleEntity(new MockDisplay(new BoundingRect(100, 200, 300, 400), new DisplayCapabilities(false, false))));

    expect(selection.display.capabilities.resizable).to.equal(false);
  });

  it("can change the bounds for multiple entities", () => {
    const selection = new VisibleEntityCollection(
      new VisibleEntity(new MockDisplay(new BoundingRect(0, 0, 100, 100))),
      new VisibleEntity(new MockDisplay(new BoundingRect(100, 100, 200, 200)))
    );

    selection.display.bounds = new BoundingRect(200, 200, 300, 300);

    expect(_simplifyBounds(selection[0].display.bounds)).to.eql([200, 200, 250, 250]);
    expect(_simplifyBounds(selection[1].display.bounds)).to.eql([250, 250, 300, 300]);
  });
});