import {
  Dependency,
  IDependencyLoader,
  BaseDependencyLoader,
  IDependencyLoaderResult,
} from "@tandem/sandbox";

import * as path from "path";
import sm = require("source-map");
import postcss = require("postcss");
import { CSS_MIME_TYPE } from "@tandem/common";

import {
  parseCSS,
} from "@tandem/synthetic-browser";

const hasProtocol = (value) => /^\w+:\/\//.test(value);

export const resolveCSSImports = (uri: string, css: string, map?: sm.RawSourceMap): { code: string, map: sm.RawSourceMap, imports: string[] } => {

    const fileDirectory = path.dirname(uri);
    const importedUris: string[] = [];
  
    const compile = (node: postcss.Node): sm.SourceNode => {
    const line = node.source.start.line;

    // inconsistencies between source maps lib and postcss -- this offset should fix that.
    const column = node.source.start.column - 1;

    let buffer: (string | sm.SourceNode)[] | string | sm.SourceNode;

    if (node.type === "root") {
      buffer = (<postcss.Root>node).nodes.map(compile);
    } else if (node.type === "rule") {
      const rule = <postcss.Rule>node;
      buffer = [rule.selector, ` {`, ...rule.nodes.map(compile), `}\n`];
    } else if (node.type === "atrule") {
      const rule = <postcss.AtRule>node;
      buffer = [`@${rule.name} ${rule.params} {`, ...rule.nodes.map(compile), `}\n`];
    } else if (node.type === "decl") {

      let { prop, value } = <postcss.Declaration>node;

      if (/url\(.*?\)/.test(value)) {

        // TODO - need to support / for root directory on index.html file
        value = value.replace(/url\((.*?)\)/g, (match, url) => {

          // this can still break, but it's a quick implementation that should work 99% of the time.
          // Good for now.
          url = url.replace(/["']/g, "");


          // ignore protocol IDs
          url = hasProtocol(url) ? url : fileDirectory + "/" + url;

          // TODO - this __needs__ to be HTTP in order for it to be supported in a web browser. 
          // Okay for now since this is running on electron
          if (!hasProtocol(url)) {
            url = `file://${url}`;
          }

          importedUris.push(url);

          return `url(${url})`;
        })
      }
      buffer = [prop, ':', value, ';'];
    }

    return new sm.SourceNode(line, column, uri,  buffer);
  }

  let result;

  result = compile(parseCSS(css, map)).toStringWithSourceMap();

  // previous map? Apply now.
  if (map) {
    result.map.applySourceMap(new sm.SourceMapConsumer(map));
  } 

  return {
    code: result.code,
    map: result.map.toJSON(),
    imports: importedUris
  }
}

export class CSSDependencyLoader extends BaseDependencyLoader {
  async load({ uri }, { type, content, map }): Promise<IDependencyLoaderResult> {
    /*const content = this.content.replace(/url\(['"]?(.*?)['"]?\)/g, (match, uri) => {
      return `url("http://${window.location.host}/asset/` + encodeURIComponent(path.join(path.dirname(this.uri), uri.split(/\?|#/).shift())) + '")';
    });*/

    const result = resolveCSSImports(uri, content, map);

    return {
      type: CSS_MIME_TYPE,
      map: result.map,
      content: result.code,
      importedDependencyUris: result.imports
    };
  }
}