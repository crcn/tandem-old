import "./scss/all.scss";
import { init } from "./index";
import { SyntheticObjectType } from "paperclip";

init({
  mount: document.getElementById("application"),
  browser: {
    windows: [],
    type: SyntheticObjectType.BROWSER
  }
})