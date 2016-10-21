import * as postcss from "postcss";

import { IRange } from "@tandem/common";
import { RawSourceMap } from "source-map";

const _cache = {};

export function parseCSS(source: string, map?: RawSourceMap): postcss.Root {
  if (_cache[source]) return _cache[source].clone();
  return _cache[source] = postcss.parse(source, map ? {
    map: {
      prev: map
    }
  } : undefined);
}
