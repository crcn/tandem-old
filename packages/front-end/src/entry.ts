import { init } from "./index";
import { createRootInspectorNode } from "paperclip";

init({
  mount: document.getElementById("application"),
  editorWindows: [],
  customChrome: false,
  selectedInspectorNodes: [],
  hoveringInspectorNodes: [],
  selectedFileNodeIds: [],
  sourceNodeInspector: createRootInspectorNode(),
  sourceNodeInspectorMap: {},
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
