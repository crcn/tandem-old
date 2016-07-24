import {
  FragmentDictionary,
  BaseFragment
} from "./index";

import { expect } from "chai";

describe(__filename + "#", () => {
  describe("FragmentDictionary#", () => {
    it("can be created", () => {
      new FragmentDictionary();
    });

    it("can query for a fragment", () => {
      const ab = new BaseFragment("a/b");
      const fragments = new FragmentDictionary(ab, new BaseFragment("c/d"));
      expect(fragments.query("a/b")).to.equal(ab);
    });


    it("throws an error if a ns already exists", () => {
      expect(() => new FragmentDictionary(new BaseFragment("a/b"), new BaseFragment("a/b"))).to.throw("Fragment with namespace \"a/b\" already exists.");
    });

    it("registers fragments when calling register()", () => {
      const fragments = new FragmentDictionary();
      const ab = new BaseFragment("a/b");
      fragments.register(ab);
      expect(fragments.query("a/b")).to.equal(ab);
    });


    it("can query for multiple fragments that share the same path", () => {
      const fragments = new FragmentDictionary(
        new BaseFragment("a/b"),
        new BaseFragment("a/c"),
        new BaseFragment("a/d"),
        new BaseFragment("a/d/e"),
        new BaseFragment("a/d/f"),
        new BaseFragment("b/c"),
        new BaseFragment("b")
      );

      expect(fragments.queryAll("a/**").length).to.equal(5);
      expect(fragments.queryAll("a/d/**").length).to.equal(2); // a/d/e, a/d/f
      expect(fragments.queryAll("/**").length).to.equal(fragments.length);
    });

    it("can create a child fragment with the same fragments", () => {
      const fragments = new FragmentDictionary(new BaseFragment("a/b"), new BaseFragment("b/c"));
      const child = fragments.createChild();
      expect(child.length).to.equal(fragments.length);
    });

    it("can register multiple fragments via register()", () => {
      const fragments = new FragmentDictionary();
      fragments.register(new BaseFragment("a/b"), new BaseFragment("b/c"));
      expect(fragments.length).to.equal(2);
    });

    it("can register nested fragments", () => {
      const fragments = new FragmentDictionary();
      let de;
      fragments.register(new BaseFragment("a/b"), new BaseFragment("b/c"), [new BaseFragment("b/d"), [de = new BaseFragment("d/e")]]);
      expect(fragments.length).to.equal(4);
      expect(fragments.query('d/e')).to.equal(de);
    });
  });
});