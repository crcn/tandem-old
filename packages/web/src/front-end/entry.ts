import { rootSaga } from "./sagas";
import { select, take, call } from "redux-saga/effects";
import { rootReducer } from "./reducers";
import * as mime from "mime-types";
import {
  setup,
  RootState,
  FontFamily,
  createRootInspectorNode,
  ContextMenuItem,
  EditMode,
  RootReadyType
} from "tandem-front-end";
import {
  stripProtocol,
  createDirectory,
  addProtocol,
  normalizeFilePath,
  FILE_PROTOCOL,
  createFile,
  Point
} from "tandem-common";
// import { DesktopRootState } from "./state";
import * as path from "path";
import * as Url from "url";
import {
  Frame,
  getSyntheticSourceNode,
  getSyntheticNodeById,
  getPCNodeDependency
} from "paperclip";
import { eventChannel } from "redux-saga";
import { init as initSentry } from "@sentry/browser";
import { FileOpenerOptions } from "tandem-front-end/src/components/contexts";
const pkg = require("../../package.json");

initSentry({
  dsn: "https://a2621f1c757749a895ba5ad69be5ac76@sentry.io/1331704",
  release: pkg.version
});

const query = Url.parse(String(location), true).query;

const init = setup(
  function*() {
    return {
      readFile,
      writeFile,
      openPreview,
      loadProjectInfo,
      readDirectory,
      openContextMenu,
      deleteFile,
      openFile
    };
  },
  rootReducer,
  rootSaga
);

const openFile = (options: FileOpenerOptions) => {
  return new Promise<string>(resolve => {});
};

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

function* openPreview(frame: Frame) {
  if (!query.previewHost) {
    return false;
  }

  const state: RootState = yield select();

  const sourceNode = getSyntheticSourceNode(
    getSyntheticNodeById(frame.syntheticContentNodeId, state.documents),
    state.graph
  );
  const dep = getPCNodeDependency(sourceNode.id, state.graph);

  return true;
}

function* loadProjectInfo() {}

function* readDirectory(dirUri: string): any {
  return null;
}

function* openContextMenu(point: Point, options: ContextMenuItem[]) {}

function* deleteFile(uri: string) {
  const path = stripProtocol(uri);
}

function getFontFamiles(): FontFamily[] {
  let used = {};
  return [];
}

function readFile(uri) {
  return Promise.resolve({
    content: null,
    mimeType: null
  });
}

async function writeFile(uri: string, content: Buffer) {
  return true;
}
