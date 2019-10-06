import { rootSaga, createFrontEndSideEffects } from "./sagas";
import { rootReducer } from "./reducers";
import {
  setup,
  FontFamily,
  createRootInspectorNode,
  EditMode,
  RootReadyType
} from "tandem-front-end";
import * as Url from "url";
import { init as initSentry } from "@sentry/browser";
const pkg = require("../../package.json");

initSentry({
  dsn: "https://a2621f1c757749a895ba5ad69be5ac76@sentry.io/1331704",
  release: pkg.version
});

const query = Url.parse(String(location), true).query;

const init = setup(createFrontEndSideEffects, rootReducer, rootSaga);

const mount = document.createElement("div");
document.body.appendChild(mount);

// give some time so that the loader shows up.
setTimeout(init, 500, {
  mount,
  selectedInspectorNodes: [],
  hoveringInspectorNodes: [],
  editMode: EditMode.PRIMARY,
  customChrome: Boolean(query.customChrome),
  selectedFileNodeIds: [],
  readyType: RootReadyType.LOADING,
  unloaders: [],
  sourceNodeInspector: createRootInspectorNode(),
  sourceNodeInspectorMap: {},
  scriptProcesses: [],
  editorWindows: [],
  frames: [],
  documents: [],
  fontFamilies: getFontFamiles(),
  graph: {},
  history: {
    index: 0,
    items: []
  },
  openFiles: [],
  fileCache: {},
  selectedComponentId: null
} as any);

function getFontFamiles(): FontFamily[] {
  let used = {};
  return [];
}
