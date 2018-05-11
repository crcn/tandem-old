import { init } from "./index";
import { SyntheticObjectType } from "../paperclip";

init({
  mount: document.getElementById("application"),
  hoveringNodeIds: [],
  selectedNodeIds: [],
  canvas: {
    backgroundColor: "#EFEFEF",
    translate: {
      left: 0,
      top: 0,
      zoom: 1
    }
  },
  openFiles: [],
  browser: {
    windows: [],
    type: SyntheticObjectType.BROWSER
  }
})