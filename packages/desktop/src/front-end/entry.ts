import "tandem-front-end/lib/front-end/entry.bundle.css";
import { rootSaga } from "./sagas";
import { rootReducer } from "./reducers";
import { setup, SyntheticObjectType } from "tandem-front-end";
import { DesktopRootState } from "./state";

setup<DesktopRootState>(rootReducer, rootSaga)({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  editors: [],
  browser: {
    type: SyntheticObjectType.BROWSER,
    windows: []
  },
  history: {},
  openFiles: []
});
