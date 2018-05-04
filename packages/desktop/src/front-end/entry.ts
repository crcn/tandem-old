import "tandem-front-end/lib/front-end/entry.bundle.css";
import { init, SyntheticObjectType } from "tandem-front-end";

console.log(document.getElementById("application"));

init({
  mount: document.getElementById("application"),
  hoveringReferences: [],
  selectionReferences: [],
  browser: {
    type: SyntheticObjectType.BROWSER,
    windows: []
  },
  canvas: {
    backgroundColor: "#EFEFEF",
    translate: {
      left: 0,
      top: 0,
      zoom: 1
    }
  }
})