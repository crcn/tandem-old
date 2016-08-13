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
      const fragments = new Dependencies(ab, new Dependency<string>("c/d", undefined));
      expect(fragments.query("a/b")).not.to.equal(undefined);
    });

    it("throws an error if a ns already exists", () => {
      expect(() => new Dependencies(new Dependency<string>("a/b", undefined), new Dependency<string>("a/b", undefined))).to.throw("Dependency with namespace \"a/b\" already exists.");
    });

    it("registers fragments when calling register()", () => {
      const fragments = new Dependencies();
      const ab = new Dependency<string>("a/b", "a");
      fragments.register(ab);
      expect(fragments.query("a/b")).not.to.equal(undefined);
    });


    it("can query for multiple fragments that share the same path", () => {
      const fragments = new Dependencies(
        new UndefinedDependency("a/b"),
        new UndefinedDependency("a/c"),
        new UndefinedDependency("a/d"),
        new UndefinedDependency("a/d/e"),
        new UndefinedDependency("a/d/f"),
        new UndefinedDependency("b/c"),
        new UndefinedDependency("b")
      );

      expect(fragments.queryAll("a/**").length).to.equal(5);
      expect(fragments.queryAll("a/d/**").length).to.equal(2); // a/d/e, a/d/f
      expect(fragments.queryAll("/**").length).to.equal(fragments.length);
    });

    it("can create a child fragment with the same fragments", () => {
      const fragments = new Dependencies(new UndefinedDependency("a/b"), new UndefinedDependency("b/c"));
      const child = fragments.createChild();
      expect(child.length).to.equal(fragments.length);
    });

    it("can register multiple fragments via register()", () => {
      const fragments = new Dependencies();
      fragments.register(new UndefinedDependency("a/b"), new UndefinedDependency("b/c"));
      expect(fragments.length).to.equal(2);
    });

    it("can register nested fragments", () => {
      const fragments = new Dependencies();
      let de;
      fragments.register(new UndefinedDependency("a/b"), new UndefinedDependency("b/c"), [new UndefinedDependency("b/d"), [de = new UndefinedDependency("d/e")]]);
      expect(fragments.length).to.equal(4);
      expect(fragments.query("d/e")).not.to.equal(undefined);
    });
  });
});