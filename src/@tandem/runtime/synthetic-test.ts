import { expect } from "chai";
import { WrapBus } from "mesh";
import { Action } from "@tandem/common";
import { SyntheticObject, SyntheticValueObject, SyntheticAction } from "@tandem/runtime";

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

      expect(a.get<SyntheticValueObject<string>>("one")).to.equal(one);
      expect(a.get<SyntheticValueObject<string>>("two")).to.equal(two);
      expect(a.get<SyntheticValueObject<string>>("one").value).to.equal(2);
      expect(a.get<SyntheticValueObject<string>>("two").value).to.equal(3);
      expect(a.get<SyntheticValueObject<string>>("three").value).to.equal(4);
    });

    it("dispatches a change action when patched", () => {
      let currentAction: Action;
      const observer = new WrapBus(action => currentAction = action);
      const object = new SyntheticObject();
      object.observe(observer);
      object.patch(new SyntheticObject({ a: new SyntheticValueObject("b") }));
      expect(object.get<SyntheticValueObject<string>>("a").value).to.equal("b");
      expect(currentAction.type).to.equal(SyntheticAction.PATCHED);
    });
  });
});