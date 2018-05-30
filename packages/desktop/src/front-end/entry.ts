import "tandem-front-end/lib/front-end/entry.bundle.css";
import * as fs from "fs";
import { rootSaga } from "./sagas";
import { rootReducer } from "./reducers";
import { setup } from "tandem-front-end";
import { DesktopRootState } from "./state";

const openFile = uri => fs.readFileSync(uri.substr("file://".length), "utf8");

setup<DesktopRootState>({ openFile }, rootReducer, rootSaga)({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  editors: [],
  syntheticFrames: {},
  graph: {},
  history: {},
  openFiles: []
});
