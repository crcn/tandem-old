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
  createPCSlot,
  createPCComponentInstance,
  createPCPlug
} from "../dsl";
import { expect } from "chai";
import {
  refreshInspectorTree,
  createRootInspectorNode,
  expandInspectorNode,
  InspectorNode
} from "../inspector";
import { DependencyGraph } from "../graph";
import { TreeNode, replaceNestedNode, removeNestedTreeNode, insertChildNode, appendChildNode } from "tandem-common";
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
    createPCModule([createPCTextNode("text node here")])
  ];

  const case3 = () => {
    return [
      "Can insert a new slot into a component",
      createPCModule([createPCComponent(null, "div", {}, {})]),
      createPCModule([createPCComponent(null, "div", {}, {}, [createPCSlot()])])
    ];
  };

  const case4 = () => {

    const slotChild = createPCTextNode("a b");

    const slot = createPCSlot([slotChild]);

    const component = createPCComponent(null, "div", {}, {}, [
      slot
    ]);

    const module = createPCModule([
      component
    ]);

    let module2 = module;

    module2 = replaceNestedNode(createPCElement("div"), slotChild.id, module2);



    return [
      "Can update the default children of a slot",
      module,
      module2
    ];
  };

  const case5 = () => {

    const slotChild = createPCTextNode("a b");

    const slot = createPCSlot([slotChild]);

    const component = createPCComponent(null, "div", {}, {}, [
      slot
    ]);
    const instance = createPCComponentInstance(component.id);
    const instance2 = createPCComponentInstance(component.id);

    const module = createPCModule([
      component,
      instance,
      instance2
    ]);

    let module2 = module;

    module2 = replaceNestedNode(createPCElement("div"), slotChild.id, module2);

    return [
      "Updates slot children of component instance",
      module,
      module2
    ];
  };

  const case6 = () => {

    const element1 = createPCElement("div");
    const element2 = createPCElement("span");

    const module = createPCModule([
      element1,
      element2
    ]);

    let module2 = module;

    module2 = removeNestedTreeNode(element2, module2);
    module2 = insertChildNode(element2, 0, module2);

    return [
      "Can move elements around",
      module,
      module2
    ]
  }

  const case7 = () => {

    const slot = createPCSlot([
      createPCTextNode("abcd")
    ]);

    const component = createPCComponent(null, "div", null, null, [
      slot
    ]);

    let instance = createPCComponentInstance(component.id, null);

    const module = createPCModule([
      component,
      instance
    ]);

    let module2 = module;


    instance = appendChildNode(createPCPlug(slot.id, [
      createPCElement("span")
    ]), instance);

    module2 = replaceNestedNode(instance, instance.id, module2);


    return [
      "Can insert a new plug",
      module,
      module2
    ]
  };

  const case8 = () => {
    const slot = createPCSlot();

    const component = createPCComponent(null, "div", null, null, [
      slot
    ]);
    let plug = createPCPlug(slot.id);
    const instance = createPCComponentInstance(component.id, null, null, [
      plug
    ]);

    const module = createPCModule([
      component,
      instance
    ]);
    let module2 = module;
    plug = insertChildNode(createPCTextNode("abc"), 0, plug);
    module2 = replaceNestedNode(plug, plug.id, module2);
    return [
      "Can insert a child into a plug",
      module,
      module2
    ]
  };

  [case1(), case2(), case3(), case4(), case5(), case6(), case7(), case8()].forEach(([label, a, b]) => {
    it(label as string, () => {

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
      [newRootInspector] = refreshInspectorTree(
        newRootInspector,
        newGraph,
        ["a"]
      );
      expect(zeroIds(rootInspector)).to.eql(zeroIds(newRootInspector));
    });
  });
});
