import { init } from "./index";

init({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  editorWindows: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  moduleInspectors: [],
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
