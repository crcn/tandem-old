import { expect } from "chai";
import {
  createPCFrame,
  createPCElement,
  diffSyntheticNode,
  patchSyntheticNode,
  evaluatePCModule,
  createPCModule
} from ".";
import { updateNestedNode, cloneTreeNode } from "tandem-common";

describe(__filename + "#", () => {
  [
    [createPCElement("div"), node => ({ ...node, is: "span" })],

    // insert child
    [
      createPCElement("div"),
      node => ({ ...node, children: [createPCElement("div")] })
    ]
  ].forEach(([oldNode, updater]: any) => {
    it(`can transform from ${JSON.stringify(oldNode)} to ${JSON.stringify(
      updater(oldNode)
    )}`, () => {
      const frame = createPCFrame([oldNode]);

      const module = createPCModule([frame]);

      const updatedModule = updateNestedNode(oldNode, module, updater);

      const oldFrame = evaluatePCModule(module)[frame.id];
      const newFrame = evaluatePCModule(updatedModule)[frame.id];

      const ots = diffSyntheticNode(oldFrame.root, newFrame.root);

      expect(nodeIdCleaner()(patchSyntheticNode(ots, oldFrame.root))).to.eql(
        nodeIdCleaner()(newFrame.root)
      );
    });
  });
});

const nodeIdCleaner = (i = 0) => {
  let alreadyReset: any = {};
  return node => {
    return cloneTreeNode(node, child => {
      if (alreadyReset[child.id]) return child.id;
      const newId = String("00000000" + i++);
      alreadyReset[newId] = 1;
      return newId;
    });
  };
};
