import "./styles";

import config from "./config";
import { isMaster, fork } from "@tandem/common/workers";
import { FrontEndApplication } from "./application";

// none for now - need to figure out NULL exceptions with
// workers.
const NUM_WORKERS = 0;

if (isMaster) {

  window.onload = () => {
    const app = window["app"] = new FrontEndApplication(Object.assign(config, {
      element: document.getElementById("app")
    }));
    app.initialize();
  };

  for (let i = NUM_WORKERS; i--; ) fork();
}
