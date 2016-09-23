import { SyntheticObject, SyntheticValueObject } from "./synthetic";
import { expect } from "chai";

describe(__filename + "#", () => {
  describe("SyntheticObject#", () => {
    it("can be patched", () => {

      const one = new SyntheticValueObject(1);
      const two = new SyntheticValueObject(2);

      const a = new SyntheticObject({
        "one": one,
        "two": two
      });

      const b = new SyntheticObject({
        "one": new SyntheticValueObject(2),
        "two": new SyntheticValueObject(3),
        "three": new SyntheticValueObject(4)
      });

      a.patch(b);

      expect(a.get("one")).to.equal(one);
      expect(a.get("two")).to.equal(two);
      expect(a.get("one").value).to.equal(2);
      expect(a.get("two").value).to.equal(3);
      expect(a.get("three").value).to.equal(4);
    });
  });
});