import { Action } from "../actions";
import { Mediator } from "./index.ts";
import { expect } from "chai";
import { BufferedBus } from "mesh";

describe(__filename + "#", () => {
  describe("Mediator#", () => {
    it("can be created", () => {
      new Mediator();
    });

    it("can execute an action against the mediator", async () => {
      let m = new Mediator();
      m.register(BufferedBus.create(void 0, "a"));
      expect((await m.execute(new Action(undefined)).read()).value).to.equal("a");
    });

    it("can register multiple actors", async () => {
      let m = new Mediator();
      m.register(
        BufferedBus.create(void 0, "a"),
        BufferedBus.create(void 0, "b"),
        BufferedBus.create(void 0, "c")
      );
      expect(await m.execute(new Action(undefined)).readAll()).to.have.members(["a", "b", "c"]);
    });

    it("can remove an actor", async () => {
      let m = new Mediator();
      let b;
      let c;
      m.register(
        BufferedBus.create(void 0, "a"),
        b = BufferedBus.create(void 0, "b"),
        c = BufferedBus.create(void 0, "c")
      );
      expect(await m.execute(new Action(undefined)).readAll()).to.have.members(["a", "b", "c"]);
      m.remove(b);
      expect(await m.execute(new Action(undefined)).readAll()).to.not.have.members(["b", "c"]);
    });
  });
});