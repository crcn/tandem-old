import { init } from "./index";
import { createRootInspectorNode } from "state/pc-inspector-tree";

init({
  mount: document.getElementById("application"),
  hoveringSyntheticNodeIds: [],
  editorWindows: [],
  selectedSyntheticNodeIds: [],
  selectedFileNodeIds: [],
  sourceNodeInspector: createRootInspectorNode(),
  selectedInspectorNodeIds: [],
  history: {
    index: 0,
    items: []
  },
  openFiles: [],
  frames: [],
  documents: [],
  graph: {},
  fileCache: {},
  selectedComponentId: null
});
