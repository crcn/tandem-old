import * as fs from "fs";
import { rootSaga } from "./sagas";
import { take, select } from "redux-saga/effects";
import { rootReducer } from "./reducers";
import { setup, RootState, stripProtocol } from "tandem-front-end";
import { DesktopRootState } from "./state";
import * as path from "path";
import * as Url from "url";
import { exec } from "child_process";
import {
  Frame,
  getSyntheticSourceNode,
  getSyntheticNodeById,
  getPCNodeDependency
} from "paperclip";

const query = Url.parse(String(location), true).query;

setup<DesktopRootState>(
  function*() {
    return {
      readFile,
      writeFile,
      openPreview
    };
  },
  rootReducer,
  rootSaga
)({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  editorWindows: [],
  frames: [],
  documents: [],
  graph: {},
  history: {},
  openFiles: [],
  fileCache: {},
  selectedComponentId: null
});

function* openPreview(frame: Frame) {
  if (!query.previewHost) {
    return false;
  }

  const state: RootState = yield select();

  const sourceNode = getSyntheticSourceNode(
    getSyntheticNodeById(frame.contentNodeId, state.documents),
    state.graph
  );
  const dep = getPCNodeDependency(sourceNode.id, state.graph);

  exec(
    `open http://${query.previewHost}/preview.html?contentNodeId=${
      sourceNode.id
    }\\&entryPath=${encodeURIComponent(stripProtocol(dep.uri))}`
  );

  return true;
}

function readFile(uri) {
  return Promise.resolve({
    content: fs.readFileSync(stripProtocol(uri)),
    mimeType: {
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".json": "application/json"
    }[path.extname(uri)]
  });
}

async function writeFile(uri: string, content: Buffer) {
  fs.writeFileSync(uri, content);
  return true;
}
