import { init } from "./index";
import { createRootInspectorNode } from "paperclip";
import { EditMode } from "./state";

init({
  mount: document.getElementById("application"),
  editorWindows: [],
  customChrome: false,
  selectedInspectorNodes: [],
  hoveringInspectorNodes: [],
  editMode: EditMode.PRIMARY,
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
