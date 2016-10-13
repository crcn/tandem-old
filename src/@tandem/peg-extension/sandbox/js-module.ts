import { CommonJSSandboxModule  } from "@tandem/javascript-extension";
import * as peg from "pegjs";

export class PegJSSandboxModule extends CommonJSSandboxModule {
  compile() {
    const parser = peg.buildParser(this.content);
    return (global, context) => context.exports = parser;
  }
}
