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
  browser: {
    type: SyntheticObjectType.BROWSER,
    windows: []
  },
  openFiles: [],
  canvas: {
    backgroundColor: "#EFEFEF",
    translate: {
      left: 0,
      top: 0,
      zoom: 1
    }
  }
});