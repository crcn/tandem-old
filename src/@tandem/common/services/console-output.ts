// DEPRECATED

import { document } from "@tandem/common/decorators";
import * as sift from "sift";
import * as chalk from "chalk";
import { Service } from "@tandem/common/services";
// import { LogAction } from "@tandem/common/actions";
import { ClassFactoryDependency } from "@tandem/common/dependencies";

// import {
//   INFO as INFO_LEVEL,
//   WARN as WARN_LEVEL,
//   ERROR as ERROR_LEVEL,
//   VERBOSE as VERBOSE_LEVEL,
// } from "@tandem/common/logger/levels";

// class ConsoleService extends Service {

//   private _filter: Function;

//   @document("sets a log filter for stdout.")
//   setLogFilter(action) {
//     this._filter = sift(action.text);
//   }

//   @document("logs to stdout")
//   log({ level, text }: LogAction) {

//     if (this._filter && !this._filter(text)) return;

//     const log = {
//       [VERBOSE_LEVEL]: console.log.bind(console),
//       [INFO_LEVEL]: console.info.bind(console),
//       [WARN_LEVEL]: console.warn.bind(console),
//       [ERROR_LEVEL]: console.error.bind(console)
//     }[level];

//     const color = {
//       [VERBOSE_LEVEL]: "grey",
//       [INFO_LEVEL]: "blue",
//       [WARN_LEVEL]: "yellow",
//       [ERROR_LEVEL]: "red",
//     }[level];

//     if (typeof window !== "undefined") {
//       log("%c: %c%s", `color: ${color}`, "color: black", text);
//     } else {
//       log("%s %s", chalk[color].bold(":"), text);
//     }
//   }
// }

// export const consoleLogServiceDependency = new ClassFactoryDependency("application/services/console", ConsoleService);
