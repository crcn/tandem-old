import "reflect-metadata";
import "./styles";

import config from "./config";
import { isMaster, fork } from "@tandem/common/workers";
import { FrontEndApplication } from "./application";

// none for now - need to figure out NULL exceptions with
// workers.
const NUM_WORKERS = 1;

if (isMaster) {

  window.onload = () => {

    if (!config.element) {
      const element = document.createElement("div");
      document.body.appendChild(element);
      Object.assign(config, { element: element });
    }

    const app = window["app"] = new FrontEndApplication(config);

    app.initialize();
  };

  for (let i = NUM_WORKERS; i--; ) fork();
}
