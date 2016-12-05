import * as path from "path";
import * as sm from "source-map";

import {
  Dependency,
  IDependencyLoader,
  IDependencyContent,
  BaseDependencyLoader,
  DefaultDependencyLoader,
  IDependencyLoaderResult,
} from "@tandem/sandbox";

import {
  inject,
  Injector,
  HTML_MIME_TYPE,
  ISourceLocation,
  ISourcePosition,
  InjectorProvider,
} from "@tandem/common";

import {
  parseMarkup,
  MarkupExpression,
  MarkupTextExpression,
  formatMarkupExpression,
  MarkupElementExpression,
  MarkupAttributeExpression,
  MarkupFragmentExpression,
  serializeMarkupExpression,
  deserializeMarkupExpression,
} from "@tandem/synthetic-browser";

interface IMarkupReplacement {
  node: MarkupExpression;
  start: number;
  end: number;
  value: string;
}

// TODO - need to add source maps here. Okay for now since line & column numbers stay
// the same even when src & href attributes are manipulated. However, the editor *will* break
// if there's a manipulated href / src attribute that shares the same line with another one.
export class HTMLDependencyLoader extends BaseDependencyLoader {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async load({ filePath, hash }, { type, content }): Promise<IDependencyLoaderResult> {

    content = String(content);
    const importedDependencyPaths = [];
    const injector = this._injector;
    const self = this;

    const ast = parseMarkup(content);
    const smg = new sm.SourceMapGenerator();

    let replacements: IMarkupReplacement[] = [];

    const addReplacement = (node: MarkupExpression, start: number, end: number, value: string) => {
      replacements.push({ node, start, end, value });
    }

    const lines = content.split("\n");

    function getPosition({ line, column }: ISourcePosition) {
      const lineChunk   = lines.slice(0, line);
      lineChunk[lineChunk.length - 1] = lineChunk[lineChunk.length - 1].substr(0, column - 1);


      return lineChunk.join("\n").length;
      // const n = lines.slice(0, line - 1).join("").length + line + lines[line - 1].substr(0, column - 1).length;
      // console.log(n, line, column, lines[line - 1].substr(0, column - 1));
      // return n;
    }

    await ast.accept({
      visitAttribute: async (attribute: MarkupAttributeExpression)  => {
        // ignore redirecting tag names
        if (/src|href/.test(attribute.name) && !/^a$/i.test(attribute.parent.nodeName)) {
          const absoluteFilePathOptions = await this.strategy.resolve(attribute.value, path.dirname(filePath));
          addReplacement(attribute, getPosition(attribute.location.start) + attribute.name.length + 2, getPosition(attribute.location.end) - 1, absoluteFilePathOptions.filePath);
          importedDependencyPaths.push(attribute.value);
        }
      },
      visitComment(comment) { },
      visitText() { },
      visitDocumentFragment(fragment) {
        return Promise.all(fragment.childNodes.map(async (childNodes) => {
          return await childNodes.accept(this);
        }));
      },
      async visitElement(element) {

        // todo later on
        // // normalize scripts here so that we just have text/javascript and text/css
        // // TODO - add source maps here.
        // if (/script|style/i.test(element.nodeName) && element.childNodes.length) {
        //   const textNode = element.childNodes[0] as MarkupTextExpression;
        //   const type     = element.getAttribute("type");

        //   if (type) {

        //     const result = await self.strategy.getLoader(null).load({ filePath, hash }, {
        //       type: type,
        //       content: textNode.nodeValue
        //     });

        //     textNode.nodeValue = result.content;
        //     element.setAttribute("type", result.type);
        //   }
        // }

        return Promise.all([...element.childNodes, ...element.attributes].map((child) => {
          return child.accept(this);
        }));
      }
    });

    replacements = replacements.sort((a, b) => a.start > b.start ? -1 : 1);

    for (const { start, value, end } of replacements) {
      content = content.substr(0, start) + value + content.substr(end);
    }

    return {
      content: content,
      type: HTML_MIME_TYPE,
      importedDependencyPaths: importedDependencyPaths
    };
  }
}