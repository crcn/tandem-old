import {
  createRootInspector,
  refreshInspector,
  addModuleInspector
} from "../inspector";
import { expect } from "chai";
import { createPCModule, PCModule, createPCDependency } from "../dsl";
import { cloneTreeNode } from "tandem-common";
import { PCEditorState } from "../edit";

describe(__filename + "#", () => {
  it("can add a module to the inspector tree", () => {
    const cleanIds = nodeIdCleaner();
    let root = createRootInspector();
    const module = cleanIds(createPCModule());
    const state = createEditorState(module);

    root = cleanIds(addModuleInspector(module, root, state.graph));

    expect(clone(root)).to.eql({
      id: "000000001",
      name: "root",
      children: [
        {
          id: "000000002",
          sourceNodeId: "000000000",
          name: "source-rep",
          children: []
        }
      ]
    });
  });

  const createEditorState = (module: PCModule) => {
    createPCDependency;
    const graph = {
      "0": createPCDependency("0", module)
    };
    let state: PCEditorState = {
      graph,
      documents: [],
      frames: [],
      fileCache: {}
    };

    // state = evaluateDependency("0", state);
    return state;
  };

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

  const clone = v => JSON.parse(JSON.stringify(v));
});
