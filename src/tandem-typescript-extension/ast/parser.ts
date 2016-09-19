import * as ts from "typescript";

import {
  mapTSASTNode
} from "./expressions";

export function parseTypescript(content: string) {
  return mapTSASTNode(ts.createSourceFile("tmp.tsx", content, ts.ScriptTarget.ES6, true));
}

window["parseTS"] = parseTypescript;