import {
  createPCElement,
  PCNode,
  createPCDependency,
  createPCModule,
  PCVisibleNode,
  PCSourceTagNames,
  createPCComponent,
  createPCTextNode,
  PCModule,
  createPCSlot
} from "../dsl";
import { expect } from "chai";
import {
  refreshInspectorTree,
  createRootInspectorNode,
  expandInspectorNode,
  InspectorNode
} from "../inspector";
import { DependencyGraph } from "../graph";
import { TreeNode } from "tandem-common";
import { patchTreeNode, diffTreeNode } from "../ot";

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

  const case1 = () => [
    "can change the element type without affecting the inspector",
    createPCModule([createPCElement("div")]),
    createPCModule([createPCElement("span")])
  ];

  const case2 = () => [
    "can replace a child node",
    createPCModule([createPCElement("div")]),
    createPCModule([createPCTextNode("text nodehere")])
  ];

  const case3 = () => {
    return [
      "Can insert a new slot into a component",
      createPCModule([createPCComponent(null, "div", {}, {})]),
      createPCModule([createPCComponent(null, "div", {}, {}, [createPCSlot()])])
    ];
  };

  const case4 = () => {
    return [
      "Can update the default children of a slot",
      createPCModule([
        createPCComponent(null, "div", {}, {}, [
          createPCSlot([createPCTextNode("a b")])
        ])
      ]),
      createPCModule([
        createPCComponent(null, "div", {}, {}, [
          createPCSlot([createPCTextNode("c d")])
        ])
      ])
    ];
  };

  [case1(), case2(), case3(), case4()].forEach(([label, a, b]) => {
    it(label as string, () => {
      a = zeroIds(a as PCModule);
      b = zeroIds(b as PCModule);

      const graph = {
        a: createPCDependency("a", a as PCModule)
      };

      let rootInspector: InspectorNode = createRootInspectorNode();
      let sourceMap;

      [rootInspector, sourceMap] = refreshInspectorTree(
        rootInspector,
        graph,
        ["a"],
        sourceMap
      );
      const newGraph = {
        a: {
          ...graph.a,
          content: patchTreeNode(
            diffTreeNode(a as PCModule, b as PCModule),
            a as PCModule
          )
        }
      };

      [rootInspector, sourceMap] = refreshInspectorTree(
        rootInspector,
        newGraph,
        ["a"],
        sourceMap,
        graph
      );

      let newRootInspector: InspectorNode = createRootInspectorNode();
      let newSourceMap;
      [newRootInspector, newSourceMap] = refreshInspectorTree(
        newRootInspector,
        newGraph,
        ["a"]
      );

      expect(zeroIds(rootInspector)).to.eql(zeroIds(newRootInspector));
      // expect(sourceMap).to.eql(newSourceMap);
    });
  });
});
