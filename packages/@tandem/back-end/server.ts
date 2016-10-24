import ServerApplication from "./application";
import defaultConfig from "./config";

export function create(config = {}) {
  var app = new ServerApplication(Object.assign({}, defaultConfig, config));
  return app;
}

process.on("unhandledRejection", function(error) {
  console.log("unhandled rejection", error);
});