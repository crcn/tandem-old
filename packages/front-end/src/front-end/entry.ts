import { init } from "./index";
import { SyntheticObjectType } from "../paperclip";

init({
  mount: document.getElementById("application"),
  hoveringReferences: [],
  selectionReferences: [],
  canvas: {
    backgroundColor: "#EFEFEF",
    translate: {
      left: 0,
      top: 0,
      zoom: 1
    }
  },
  browser: {
    windows: [],
    type: SyntheticObjectType.BROWSER
  }
})