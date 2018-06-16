import { init } from "./index";

init({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  editorWindows: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  history: {},
  openFiles: [],
  frames: [],
  documents: [],
  graph: {},
  fileCache: {}
});
