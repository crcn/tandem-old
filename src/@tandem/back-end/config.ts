import { ALL } from "@tandem/common/logger/levels";

export default {
  publicDirectory: __dirname + "/public",
  cwd: process.cwd(),
  logger: {
    level: ALL
  },
};
