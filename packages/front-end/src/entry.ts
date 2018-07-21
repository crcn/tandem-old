import { init } from "./index";
import {
  createInspectorNode,
  InspectorTreeNodeType
} from "state/pc-inspector-tree";

init({
  mount: document.getElementById("application"),
  hoveringSyntheticNodeIds: [],
  editorWindows: [],
  selectedSyntheticNodeIds: [],
  selectedFileNodeIds: [],
  sourceNodeInspector: createInspectorNode(
    InspectorTreeNodeType.ROOT,
    "",
    null,
    null
  ),
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
