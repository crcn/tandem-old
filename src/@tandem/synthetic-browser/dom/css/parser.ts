import * as postcss from "postcss";
import { RawSourceMap } from "source-map";

import {
  IASTNode,
  IRange
} from "@tandem/common";

const _cache = {};

export function parseCSS(source: string, map?: RawSourceMap): postcss.Root {
  if (_cache[source]) return _cache[source].clone();
  return _cache[source] = postcss.parse(source, {  map: map as any as postcss.SourceMapOptions || true });
}
