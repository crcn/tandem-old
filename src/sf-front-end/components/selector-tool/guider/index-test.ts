import { Guider } from "./index";
import { expect } from "chai";
import { IPosition, Position, BoundingRect } from "sf-core/geom";

describe(__filename + "#", () => {

  describe("guider#", () => {
    it("can be created", () => {
      new Guider();
    });

    it("can add new bounds", () => {
      const guider = new Guider([new BoundingRect(0, 0, 100, 100)]);
    });

    // it("can snap a rectangle to the left most corner of some bounds", () => {
    //   const guider = new Guider([new BoundingRect(0, 0, 100, 100)]);
    //   expect(guider.snap(new BoundingRect(5, 10, 100, 100)).toArray()).to.eql([0, 10, 95, 100]);
    //   expect(guider.snap(new BoundingRect(-5, 10, 100, 100)).toArray()).to.eql([0, 10, 105, 100]);
    // });

    // it("can snap a rectangle to the top most corner of some bounds", () => {
    //   const guider = new Guider([new BoundingRect(0, 0, 100, 100)]);
    //   expect(guider.snap(new BoundingRect(0, 5, 100, 100)).toArray()).to.eql([0, 0, 100, 95]);
    // });
  });
});