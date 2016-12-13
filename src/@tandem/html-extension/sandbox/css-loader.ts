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

export class CSSDependencyLoader extends BaseDependencyLoader {
  async load(dependency: Dependency, { type, content, map }): Promise<IDependencyLoaderResult> {
    /*const content = this.content.replace(/url\(['"]?(.*?)['"]?\)/g, (match, uri) => {
      return `url("http://${window.location.host}/asset/` + encodeURIComponent(path.join(path.dirname(this.uri), uri.split(/\?|#/).shift())) + '")';
    });*/

    const { uri } = dependency;
    const fileDirectory = path.dirname(uri);
    const importedUris: string[] = [];
    
    const compile = async (node: postcss.Node): Promise<sm.SourceNode> => {
      const line = node.source.start.line;

      // inconsistencies between source maps lib and postcss -- this offset should fix that.
      const column = node.source.start.column - 1;

      let buffer: (string | sm.SourceNode)[] | string | sm.SourceNode;

      if (node.type === "root") {
        buffer = await Promise.all((<postcss.Root>node).nodes.map(compile));
      } else if (node.type === "rule") {
        const rule = <postcss.Rule>node;
        buffer = [rule.selector, ` {`, ...(await Promise.all(rule.nodes.map(compile))), `}\n`];
      } else if (node.type === "atrule") {
        const rule = <postcss.AtRule>node;
        buffer = [`@${rule.name} ${rule.params}`];
        if (rule.nodes) {
          buffer.push(`{`, ...(await Promise.all(rule.nodes.map(compile))), `}\n`);
        }
      } else if (node.type === "decl") {

        let { prop, value } = <postcss.Declaration>node;

        if (/url\(.*?\)/.test(value)) {

          for (const match of value.match(/url\((.*?)\)/g)) {
            
            const [whole, url] = match.match(/url\((.*?)\)/);

            let repl;

            // this can still break, but it's a quick implementation that should work 99% of the time.
            // Good for now.
            repl = url.replace(/["']/g, "");
            repl = (await this.strategy.resolve(repl, uri)).uri;

            importedUris.push(repl);

            value = value.replace(url, repl);
          }
        }
        buffer = [prop, ':', value, ';'];
      }

      return new sm.SourceNode(line, column, uri,  buffer);
    }

    let result;

    result = (await compile(parseCSS(content, map))).toStringWithSourceMap();

    // previous map? Apply now.
    if (map) {
      result.map.applySourceMap(new sm.SourceMapConsumer(map));
    }


    return {
      type: CSS_MIME_TYPE,
      map: result.map.toJSON(),
      content: result.code,
      importedDependencyUris: importedUris
    };
  }
}