import { expect } from "chai";
import { IEntity } from "./base";
import { Node, IContainerNode, ContainerNode } from "../markup";
import { EntityEngine } from "./engine";
import { Dependencies, EntityFactoryDependency } from "../dependencies";

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

describe(__filename + "#", () => {
  it("can be created", () => {
    new EntityEngine(new Dependencies());
  });

  it("can register a custom entity", async () => {
    class CustomEntity extends Node implements IEntity {
      readonly type: string = null;
      constructor(readonly expression: any) {
        super();
      }
      render() {
        return null;
      }
      cloneNode() { return null; }
      dispose() { }
    }
    const dependencies = new Dependencies();
    dependencies.register(new EntityFactoryDependency("custom", CustomEntity));
    const engine = new EntityEngine(dependencies);
    const rootEntity = await engine.load(element("custom"));

    expect(rootEntity).to.be.an.instanceOf(CustomEntity);
  });

  it("renders child nodes based on the returned value from load()", async () => {
    class CustomEntity extends ContainerNode implements IEntity {
      readonly type: string = null;
      constructor(readonly expression: any) {
        super();
      }
      render() {
        expect((this.expression as any).nodeName).to.equal("custom1");
        return { nodeName: "#text", nodeValue: "something" };
      }
      cloneNode() { return null; }
      dispose() { }
    }

    class TextEntity extends Node implements IEntity {
      readonly type: string = null;
      constructor(readonly expression: any) {
        super();
      }
      render() {
        return null;
      }
      cloneNode() { return null; }
      dispose() { }
    }

    const dependencies = new Dependencies(
      new EntityFactoryDependency("custom1", CustomEntity),
      new EntityFactoryDependency("#text", TextEntity)
    );

    const engine = new EntityEngine(dependencies);
    let currentEntity = await engine.load(element("custom1"));
    expect((<IContainerNode><any>currentEntity).childNodes.length).to.equal(1);
  });
});