import { evaluateDependency } from "..";

describe(__filename + "#", () => {
  xit("");
  xit("can insert an element into the root document");
  xit("can insert an element into a component");
  xit("can move an element from the root into a component");
  xit("can move an element before another element");
  xit("can move an element after another element");
  xit("can change the style of an element");
  xit("can convert an element to a component");

  describe("overrides", () => {
    describe("styles", () => {
      xit("can be overriden");
    });

    describe("children", () => {
      xit("can replace an element's children");
      xit("can insert a child into an already overridden child");
      xit("can move a node into an overridden child");
      xit("can move an overridden child out of the component instance");
      xit("can replace the children of a nested component instance");
    });

    describe("variants", () => {});
  });

  describe("clipboard", () => {});

  describe("variants", () => {});
});
