import { expect } from "chai";
import {
  // evaluateDependency,
  PCEditorState,
  createPCDependency,
  PCModule,
  createPCModule,
  createPCComponent,
  persistInsertNode,
  createPCElement,
  createPCComponentInstance,
  persistRawCSSText,
  persistSyntheticVisibleNodeStyle,
  SyntheticVisibleNode,
  createPCTextNode,
  persistMoveSyntheticVisibleNode,
  SyntheticTextNode
} from "..";
import { TreeMoveOffset } from "tandem-common";

describe(__filename + "#", () => {
  const createEditorState = (module: PCModule) => {
    const graph = {
      "0": createPCDependency("0", module)
    };
    let state: PCEditorState = {
      graph,
      documents: [],
      frames: []
    };

    // state = evaluateDependency("0", state);
    return state;
  };

  it("can insert an element into the root document", () => {
    let state = createEditorState(createPCModule());
    const [document] = state.documents;
    expect(document.children.length).to.eql(0);
    state = persistInsertNode(
      createPCElement("div"),
      state.documents[0],
      TreeMoveOffset.APPEND,
      state
    );
    const [newDocument] = state.documents;
    expect(newDocument.children.length).to.eql(1);
    expect(newDocument.children[0].name).to.eql("div");
  });
  it("can move a content node into another content node", () => {
    const contentNode1Source = createPCElement("div");
    const contentNode2Source = createPCTextNode("some text");
    let state = createEditorState(
      createPCModule([contentNode1Source, contentNode2Source])
    );
    const [document] = state.documents;
    expect(document.children.length).to.eql(2);
    state = persistMoveSyntheticVisibleNode(
      document.children[1],
      document.children[0],
      TreeMoveOffset.APPEND,
      state
    );
    const [newDocument] = state.documents;
    expect(newDocument.children.length).to.eql(1);
    expect(newDocument.children[0].name).to.eql("div");
    expect(newDocument.children[0].children.length).to.eql(1);
    expect(newDocument.children[0].children[0].name).to.eql("text");
  });

  it("can move a content node before another node", () => {
    const contentNode1Source = createPCElement("div");
    const contentNode2Source = createPCTextNode("some text");
    let state = createEditorState(
      createPCModule([contentNode1Source, contentNode2Source])
    );
    const [document] = state.documents;
    expect(document.children.length).to.eql(2);
    state = persistMoveSyntheticVisibleNode(
      document.children[1],
      document.children[0],
      TreeMoveOffset.BEFORE,
      state
    );
    const [newDocument] = state.documents;
    expect(newDocument.children.length).to.eql(2);
    expect(newDocument.children[0].name).to.eql("text");
  });
  it("can move a content node after another node", () => {
    const contentNode1Source = createPCElement("div");
    const contentNode2Source = createPCTextNode("some text");
    let state = createEditorState(
      createPCModule([contentNode1Source, contentNode2Source])
    );
    const [document] = state.documents;
    expect(document.children.length).to.eql(2);
    state = persistMoveSyntheticVisibleNode(
      document.children[1],
      document.children[0],
      TreeMoveOffset.AFTER,
      state
    );
    const [newDocument] = state.documents;
    expect(newDocument.children.length).to.eql(2);
    expect(newDocument.children[0].name).to.eql("text");
  });

  xit("can insert an element into a component");
  xit("can insert an element into a content node");
  xit("can move an element before another element");
  xit("can move an element after another element");
  xit("can change the style of an element");
  xit("can convert an element to a component");

  describe("overrides", () => {
    describe("styles", () => {
      it("immediate child can be overridden", () => {
        const child = createPCElement("h1");
        const component1 = createPCComponent("A", "div", null, null, [child]);
        const instance = createPCComponentInstance(component1.id);
        let state = createEditorState(createPCModule([component1, instance]));
        expect(state.documents[0].children.length).to.eql(2);
        const instanceChild = state.documents[0].children[1]
          .children[0] as SyntheticVisibleNode;
        expect(instanceChild.name).to.eql("h1");
        state = persistSyntheticVisibleNodeStyle(
          {
            color: "red"
          },
          instanceChild,
          null,
          state
        );
        const [newDocument] = state.documents;
        const componentChild = newDocument.children[0]
          .children[0] as SyntheticVisibleNode;
        expect(componentChild.style).to.eql({});
        const newInstanceChild = newDocument.children[1]
          .children[0] as SyntheticVisibleNode;
        expect(newInstanceChild.style).to.eql({
          color: "red"
        });
      });
      it("host can be overridden", () => {
        const child = createPCElement("h1");
        const component1 = createPCComponent("A", "div", null, null, [child]);
        const instanceSource = createPCComponentInstance(component1.id);
        let state = createEditorState(
          createPCModule([component1, instanceSource])
        );
        expect(state.documents[0].children.length).to.eql(2);
        const instance = state.documents[0].children[1] as SyntheticVisibleNode;
        expect(instance.name).to.eql("div");
        state = persistSyntheticVisibleNodeStyle(
          {
            color: "red"
          },
          instance,
          null,
          state
        );
        const [newDocument] = state.documents;
        const componentChild = newDocument.children[0] as SyntheticVisibleNode;
        expect(componentChild.style).to.eql({});
        const newInstanceChild = newDocument
          .children[1] as SyntheticVisibleNode;
        expect(newInstanceChild.style).to.eql({
          color: "red"
        });
      });

      xit("nested instance child can be overridden", () => {});
    });

    describe("children", () => {
      xit("can replace an element's children");
      it("can insert a child into an already overridden child");
      it("can move a node into nested child", () => {
        const elementSource = createPCElement("div", {}, {}, [
          createPCTextNode("some text")
        ]);
        const componentSource = createPCComponent("a", null, null, null, [
          elementSource
        ]);
        const instanceSource = createPCComponentInstance(componentSource.id);
        const childSource = createPCTextNode("some other text");

        let state = createEditorState(
          createPCModule([componentSource, instanceSource, childSource])
        );

        expect(state.documents[0].children.length).to.eql(3);
        const child = state.documents[0].children[2];
        expect(child.name).to.eql("text");
        expect(
          (state.documents[0].children[0].children[0]
            .children[0] as SyntheticTextNode).value
        ).to.eql("some text");
        expect(
          state.documents[0].children[0].children[0].children.length
        ).to.eql(1);
        const instance = state.documents[0].children[1];
        state = persistMoveSyntheticVisibleNode(
          child,
          instance.children[0] as SyntheticVisibleNode,
          TreeMoveOffset.APPEND,
          state
        );

        const [newDocument] = state.documents;
        expect(newDocument.children[0].children[0].name).to.eql("div");
        expect(newDocument.children[0].children[0].children[0].name).to.eql(
          "text"
        );
        expect(newDocument.children[0].children[0].children.length).to.eql(1);
        expect(
          (newDocument.children[0].children[0].children[0] as SyntheticTextNode)
            .value
        ).to.eql("some text");
        expect(
          (newDocument.children[1].children[0].children[0] as SyntheticTextNode)
            .value
        ).to.eql("some other text");
      });
      it("can move a node into an instance root", () => {
        const elementSource = createPCElement("div", {}, {}, [
          createPCTextNode("some text")
        ]);
        const componentSource = createPCComponent("a", null, null, null, [
          elementSource
        ]);
        const instanceSource = createPCComponentInstance(componentSource.id);
        const childSource = createPCTextNode("some other text");

        let state = createEditorState(
          createPCModule([componentSource, instanceSource, childSource])
        );

        expect(state.documents[0].children.length).to.eql(3);
        const child = state.documents[0].children[2];
        expect(child.name).to.eql("text");
        expect(
          (state.documents[0].children[0].children[0]
            .children[0] as SyntheticTextNode).value
        ).to.eql("some text");
        expect(
          state.documents[0].children[0].children[0].children.length
        ).to.eql(1);
        const instance = state.documents[0].children[1];
        state = persistMoveSyntheticVisibleNode(
          child,
          instance as SyntheticVisibleNode,
          TreeMoveOffset.APPEND,
          state
        );

        const [newDocument] = state.documents;
        expect(newDocument.children[1].children[0].name).to.eql("text");
      });
      xit("can move an overridden child out of the component instance");
      xit("can replace the children of a nested component instance");
    });

    describe("variants", () => {});
  });

  describe("clipboard", () => {});

  describe("variants", () => {});
});
