import { init } from "./index";
import { createRootInspectorNode } from "paperclip";

init({
  mount: document.getElementById("application"),
  hoveringSyntheticNodeIds: [],
  editorWindows: [],
  selectedSyntheticNodeIds: [],
  hoveringInspectorNodeIds: [],
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
