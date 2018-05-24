import * as fs from "fs";
import { compilePaperclipToReact } from "paperclip-react-compiler";

// TODO - use options for
module.exports = function(source) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const uri = this.resource;
  callback(null, compilePaperclipToReact(fs.readFileSync(uri, "utf8")));
};
