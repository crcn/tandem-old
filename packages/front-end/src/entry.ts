import { init } from "./index";
import { SyntheticObjectType } from "paperclip";

init({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  editors: [],
  selectedNodeIds: [],
  selectedFileNodeIds: [],
  history: {},
  openFiles: [],
  browser: {
    windows: [],
    type: SyntheticObjectType.BROWSER
  }
});
