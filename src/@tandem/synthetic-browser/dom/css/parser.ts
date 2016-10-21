import * as postcss from "postcss";

import { IRange } from "@tandem/common";
import { RawSourceMap } from "source-map";

const _cache = {};

export function parseCSS(source: string, map?: RawSourceMap, syntax?: any): postcss.Root {
  if (_cache[source]) return _cache[source].clone();
  return _cache[source] = postcss().process(source, {
    syntax: syntax,
    map: map && {
      prev: map
    }
  }).root;
}
