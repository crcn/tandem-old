import "reflect-metadata";
import "./styles";

import config from "./config";
import { isMaster, fork } from "@tandem/common/workers";
import { FrontEndApplication } from "./application";

// none for now - need to figure out NULL exceptions with
// workers.
const NUM_WORKERS = 0;

if (isMaster) {

  window.onload = () => {

    const element = document.createElement("div");;
    document.body.appendChild(element);

    const app = window["app"] = new FrontEndApplication(Object.assign(config, {
      element: element
    }));
    app.initialize();
  };

  for (let i = NUM_WORKERS; i--; ) fork();
}
