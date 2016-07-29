import { expect } from "chai";
import { IEntity } from "./base";
import { Node, IContainerNode, ContainerNode } from "../markup";
import { EntityEngine } from "./engine";
import { FragmentDictionary, EntityFactoryFragment } from "../fragments";

function element(name, attributes = [], ...childNodes) {
  return {
    name: name,
    nodeName: name,
    attributes: attributes,
    childNodes: childNodes
  };
}

function text(nodeValue) {
  return {
    name: "#text",
    nodeValue: nodeValue
  };
}

describe(__filename + "#", function() {
  it("can be created", function() {
    new EntityEngine(new FragmentDictionary());
  });

  it("can register a custom entity", async function() {
    class CustomEntity extends Node implements IEntity {
      constructor(readonly expression: any) {
        super();
      }
      render() {
        return null;
      }
      cloneNode() { return null; }
    }
    const fragments = new FragmentDictionary();
    fragments.register(new EntityFactoryFragment("custom", CustomEntity));
    const engine = new EntityEngine(fragments);
    const rootEntity = await engine.load(element("custom"));

    expect(rootEntity).to.be.an.instanceOf(CustomEntity);
  });

  it("renders child nodes based on the returned value from load()", async function() {
    class CustomEntity extends ContainerNode implements IEntity {
      constructor(readonly expression: any) {
        super();
      }
      render() {
        expect((this.expression as any).nodeName).to.equal("custom1");
        return { nodeName: "#text", nodeValue: "something" };
      }
      cloneNode() { return null; }
    }

    class TextEntity extends Node implements IEntity {
      constructor(readonly expression: any) {
        super();
      }
      render() {
        return null;
      }
      cloneNode() { return null; }
    }

    const fragments = new FragmentDictionary(
      new EntityFactoryFragment("custom1", CustomEntity),
      new EntityFactoryFragment("#text", TextEntity)
    );
    const engine = new EntityEngine(fragments);
    let currentEntity = await engine.load(element("custom1"));
    expect((<IContainerNode><any>currentEntity).childNodes.length).to.equal(1);
  });
});