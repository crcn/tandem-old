import {
  createPCElement,
  PCNode,
  createPCDependency,
  createPCModule,
  PCVisibleNode,
  PCSourceTagNames
} from "../dsl";
import { expect } from "chai";
import {
  refreshInspectorTree,
  createRootInspectorNode,
  expandInspectorNode
} from "../inspector";
import { DependencyGraph } from "../graph";
import { TreeNode } from "tandem-common";

describe(__filename + "#", () => {
  const A_DEP_URI = "a.pc";

  const zeroIds = (node: TreeNode<any>) => {
    let _i = 0;
    const map = (node: TreeNode<any>) => ({
      ...node,
      id: `${_i++}`,
      children: node.children.map(map)
    });

    return map(node);
  };

  const wrapPcNodeInGraph = (node: PCVisibleNode): DependencyGraph => ({
    [A_DEP_URI]: createPCDependency(A_DEP_URI, zeroIds(createPCModule([node])))
  });

  it("can represent an element", () => {
    const pcNode = createPCElement("div");
    console.log(wrapPcNodeInGraph(pcNode));
    const [inspectorNode] = refreshInspectorTree(
      createRootInspectorNode(),
      wrapPcNodeInGraph(pcNode),
      [A_DEP_URI]
    );
    expect(inspectorNode.children.length).to.eql(1);
    expect(zeroIds(inspectorNode)).to.eql({
      id: "0",
      name: "root",
      children: [
        {
          id: "1",
          name: "source-rep",
          children: [
            {
              id: "2",
              name: "source-rep",
              children: [],
              instancePath: "",
              expanded: false,
              assocSourceNodeId: "1",
              alt: true
            }
          ],
          instancePath: "",
          expanded: true,
          assocSourceNodeId: "0",
          alt: false
        }
      ],
      expanded: true,
      instancePath: null,
      assocSourceNodeId: null,
      alt: true
    });
  });
  it("can represent a text node");
  it("can represent a component");
  it("can represent a component instance");

  it("can patch in a new slot for components & instances", () => {});
});
