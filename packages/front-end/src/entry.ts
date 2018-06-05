import { init } from "./index";

init({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  editors: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  history: {},
  openFiles: [],
  frames: [],
  documents: [],
  graph: {},
  fileCache: {}
});
