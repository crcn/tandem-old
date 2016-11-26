import * as postcss from "postcss";
import { parse as parseCSSDeclValue } from "./decl-value-parser.peg";

import { IRange } from "@tandem/common";
import { RawSourceMap } from "source-map";

export function parseCSS(source: string, map?: RawSourceMap, syntax?: any, useCache?: boolean): postcss.Root {
  return postcss().process(source, {
    syntax: syntax,
    map: map && {
      prev: map
    }
  }).root;
}

export { parseCSSDeclValue };