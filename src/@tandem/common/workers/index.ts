import { ENV_IS_NODE } from "@tandem/common/utils";
export * from "./node";
module.exports = ENV_IS_NODE ? require("./node") : require("./browser");
