import "tandem-front-end/lib/front-end/entry.bundle.css";
import * as fs from "fs";
import { rootSaga } from "./sagas";
import { rootReducer } from "./reducers";
import { setup } from "tandem-front-end";
import { DesktopRootState } from "./state";
import * as path from "path";
import { openPCConfig, findPaperclipSourceFiles } from "paperclip";

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

const getPaperclipUris = async () => {
  // TODO - need to hit back-end API for this since CWD could be different
  return findPaperclipSourceFiles(
    openPCConfig(process.cwd()),
    process.cwd()
  ).map(path => "file://" + path);
};

setup<DesktopRootState>(
  { readFile, writeFile, getPaperclipUris },
  rootReducer,
  rootSaga
)({
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
