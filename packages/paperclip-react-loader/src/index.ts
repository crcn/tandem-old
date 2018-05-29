import * as fs from "fs";
import { translatePaperclipModuleToReact } from "paperclip-react-compiler";
import * as migrate from "paperclip-migrator";

// TODO - use options for
module.exports = function(source) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const uri = this.resource;
  callback(
    null,
    translatePaperclipModuleToReact(
      migrate(JSON.parse(fs.readFileSync(uri, "utf8")))
    )
  );
};
