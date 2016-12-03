import * as postcss from "postcss";

import { IRange } from "@tandem/common";
import { RawSourceMap } from "source-map";

let _cache: { [Identifier: string]: postcss.Root } = {
  
};

// can be an expensive operation. Caching helps
export function parseCSS(source: string, map?: RawSourceMap, syntax?: any, useCache?: boolean): postcss.Root {
  return useCache !== false && _cache[source] ? _cache[source].clone() : (_cache[source] =  postcss().process(source, {
    syntax: syntax,
    map: map && {
      prev: map
    }
  }).root);
}

setInterval(() => {
  _cache = {};
}, 1000 * 60);