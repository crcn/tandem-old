import { expect } from "chai";
import { IEntity, IEntityEngine, IContainerEntity } from "./base";
import { EntityEngine } from "./engine";
import { Node, IContainerNode, Element, ContainerNode } from "../markup";
import { Dependencies, EntityFactoryDependency, DocumentEntityFactoryDependency } from "../dependencies";

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
      public engine: IEntityEngine;
      constructor(readonly source: any) {
        super();
      }
      cloneNode() { return null; }
      dispose() { }
      updateSource() {
      }
    }
    const dependencies = new Dependencies();
    dependencies.register(new DocumentEntityFactoryDependency(ContainerNode), new EntityFactoryDependency("custom", CustomEntity));
    const engine = new EntityEngine(dependencies);
    const rootEntity = await engine.load(element("custom"));

    expect(rootEntity).to.be.an.instanceOf(CustomEntity);
  });

  it("renders child nodes based on the returned value from load()", async () => {
    class CustomEntity extends ContainerNode implements IEntity {
      readonly type: string = null;
      public engine: IEntityEngine;
      constructor(readonly source: any) {
        super();
      }
      static mapSourceChildren(source: any) {
        expect(source.nodeName).to.equal("custom1");
        return [{ nodeName: "#text", nodeValue: "something" }];
      }
      cloneNode() { return null; }
      dispose() { }
      updateSource() {
        return this.source.toString();
      }
    }

    class TextEntity extends Node implements IEntity {
      readonly type: string = null;
      public engine: IEntityEngine;
      constructor(readonly source: any) {
        super();
      }
      cloneNode() { return null; }
      dispose() { }
      updateSource() {

      }
    }

    const dependencies = new Dependencies(
      new DocumentEntityFactoryDependency(ContainerNode),
      new EntityFactoryDependency("custom1", CustomEntity),
      new EntityFactoryDependency("#text", TextEntity)
    );

    const engine = new EntityEngine(dependencies);
    let currentEntity = await engine.load(element("custom1"));
    expect((<IContainerNode><any>currentEntity).childNodes.length).to.equal(1);
  });
});