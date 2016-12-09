import path =  require("path");
import sm = require("source-map");

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
  MarkupCommentExpression,
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

const hasProtocol = (value) => !!/\w+:\/\//.test(value);

// TODO - need to add source maps here. Okay for now since line & column numbers stay
// the same even when src & href attributes are manipulated. However, the editor *will* break
// if there's a manipulated href / src attribute that shares the same line with another one.
export class HTMLDependencyLoader extends BaseDependencyLoader {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async load({ uri, hash }, { type, content }): Promise<IDependencyLoaderResult> {


    const expression = parseMarkup(String(content));
    const imports: string[] = [];
    const dirname = path.dirname(uri);

    const sourceNode = (await expression.accept({
      visitAttribute({ name, value, location }: MarkupAttributeExpression) {

        if (/src|href/.test(name) && !hasProtocol(value)) {
          value = dirname + "/" + value;
          if (!hasProtocol(value)) {
            value = "file://" + value;
          }
          imports.push(value);
        }
        
        return new sm.SourceNode(location.start.line, location.start.column, uri, [" ", name, `="`, value,`"`]);
      },
      async visitElement({ nodeName, attributes, childNodes, location }: MarkupElementExpression) {
        return new sm.SourceNode(location.start.line, location.start.column, uri, [
          `<` + nodeName,
          ...(await Promise.all(attributes.map((attrib) => attrib.accept(this)))),
          `>`,
          ...(await Promise.all(childNodes.map((child) => child.accept(this)))),
          `</${nodeName}>`
        ])
      },
      async visitComment({ location, nodeValue }: MarkupCommentExpression) {
        return new sm.SourceNode(location.start.line, location.start.column, uri, [`<!--${nodeValue}-->`]);
      },
      async visitText({ nodeValue, location }: MarkupTextExpression) {
        return new sm.SourceNode(location.start.line, location.start.column, uri, [nodeValue]);
      },
      async visitDocumentFragment({ childNodes, location }: MarkupFragmentExpression) {
        return new sm.SourceNode(location.start.line, location.start.column, uri, (await Promise.all(childNodes.map((child) => {
          return child.accept(this);
        }))));
      }
    })) as sm.SourceNode;

    const result = sourceNode.toStringWithSourceMap();
    
    return {
      content: result.code,
      map: result.map.toJSON(),
      type: HTML_MIME_TYPE,
      importedDependencyUris: imports
    };
  }
}