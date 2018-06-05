import "tandem-front-end/lib/front-end/entry.bundle.css";
import * as fs from "fs";
import { rootSaga } from "./sagas";
import { rootReducer } from "./reducers";
import { setup } from "tandem-front-end";
import { DesktopRootState } from "./state";
import * as path from "path";

const readFile = uri => {
  return Promise.resolve({
    content: fs.readFileSync(uri.substr("file://".length)),
    mimeType: {
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".json": "application/json"
    }[path.extname(uri)]
  });
};

const writeFile = async (uri: string, content: Buffer) => {
  fs.writeFileSync(uri, content);
  return true;
};

setup<DesktopRootState>({ readFile, writeFile }, rootReducer, rootSaga)({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  editors: [],
  frames: [],
  documents: [],
  graph: {},
  history: {},
  openFiles: [],
  fileCache: {}
});
