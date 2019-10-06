import { setupMockApp } from "./mock";
import {
  createRootInspectorNode,
  EditMode,
  RootReadyType,
  RootState
} from "../../..";
import { basicStub } from "../stubs";

const initialState: RootState = {
  mount: document.getElementById("application"),
  selectedInspectorNodes: [],
  beta: {
    showNewRightGutter: true
  },
  hoveringInspectorNodes: [],
  editMode: EditMode.PRIMARY,
  customChrome: false,
  selectedFileNodeIds: [],
  readyType: RootReadyType.LOADING,
  unloaders: [],
  sourceNodeInspector: createRootInspectorNode(),
  sourceNodeInspectorMap: {},
  scriptProcesses: [],
  editorWindows: [],
  frames: [],
  documents: [],
  fontFamilies: [],
  graph: {},
  history: {
    index: 0,
    items: []
  },
  openFiles: [],
  fileCache: {},
  selectedComponentId: null
};

setupMockApp({
  rootDirectory: basicStub,
  initialState
});
