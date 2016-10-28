import { expect } from "chai";
import {
  Dependency,
  Dependencies,
} from "./base";


describe(__filename + "#", () => {
  describe("Dependencies#", () => {
    it("can be created", () => {
      new Dependencies();
    });

    class UndefinedDependency extends Dependency<string> {
      constructor(ns: string) {
        super(ns, undefined);
      }
    }

    it("can query for a fragment", () => {
      const ab = new Dependency<string>("a/b", undefined);
      const deps = new Dependencies(ab, new Dependency<string>("c/d", undefined));
      expect(deps.query("a/b")).not.to.equal(undefined);
    });

    it("registers deps when calling register()", () => {
      const deps = new Dependencies();
      const ab = new Dependency<string>("a/b", "a");
      deps.register(ab);
      expect(deps.query("a/b")).not.to.equal(undefined);
    });


    it("can query for multiple deps that share the same path", () => {
      const deps = new Dependencies(
        new UndefinedDependency("a/b"),
        new UndefinedDependency("a/c"),
        new UndefinedDependency("a/d"),
        new UndefinedDependency("a/d/e"),
        new UndefinedDependency("a/d/f"),
        new UndefinedDependency("b/c"),
        new UndefinedDependency("b")
      );

      expect(deps.queryAll("a/**").length).to.equal(5);
      expect(deps.queryAll("a/d/**").length).to.equal(2); // a/d/e, a/d/f
      expect(deps.queryAll("/**").length).to.equal(deps.length);
    });

    it("can create a child fragment with the same deps", () => {
      const deps = new Dependencies(new UndefinedDependency("a/b"), new UndefinedDependency("b/c"));
      const child = deps.clone();
      expect(child.length).to.equal(deps.length);
    });

    it("can register multiple deps via register()", () => {
      const deps = new Dependencies();
      deps.register(new UndefinedDependency("a/b"), new UndefinedDependency("b/c"));
      expect(deps.length).to.equal(2);
    });

    it("can register nested deps", () => {
      const deps = new Dependencies();
      let de;
      deps.register(new UndefinedDependency("a/b"), new UndefinedDependency("b/c"), [new UndefinedDependency("b/d"), [de = new UndefinedDependency("d/e")]]);
      expect(deps.length).to.equal(4);
      expect(deps.query("d/e")).not.to.equal(undefined);
    });
  });
});