import * as path from "path";

import { init } from "./desktop";

let dir = process.argv[2] || ".";

if (dir.charAt(0) !== "/") {
  dir = path.join(process.cwd(), dir);
}

init({
  projectDirectory: dir,
  info: {}
});
