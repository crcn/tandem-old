// import "reflect-metadata";
// import "./styles";

// import config from "./config";
// import { isMaster, fork, hook } from "@tandem/common/workers";
// import { FrontEndApplication } from "./application";

// // none for now - need to figure out NULL exceptions with
// // workers.
// const NUM_WORKERS = 1;

// if (isMaster) {

//   window.onload = () => {

//     if (!config.element) {
//       const element = document.createElement("div");
//       document.body.appendChild(element);
//       Object.assign(config, { element: element });
//     }

//     const app = window["app"] = new FrontEndApplication(config);
//     for (let i = NUM_WORKERS; i--; ) app.bus.register(fork(app.bus));
//     app.initialize();
//   };

// } else {
//   const app = new FrontEndApplication(config);
//   app.bus.register(hook(app.bus));
//   app.initialize();
// }
