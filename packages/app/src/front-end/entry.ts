import "./scss/all.scss";
import { init } from "./index";
import { SyntheticObjectType } from "paperclip";

init({
  mount: document.getElementById("application"),
  hoveringReferences: [],
  selectionReferences: [],
  browser: {
    windows: [],
    type: SyntheticObjectType.BROWSER
  }
})