import path =  require("path");
import sm = require("source-map");

import {
  Dependency,
  IDependencyLoader,
  IDependencyContent,
  BaseDependencyLoader,
  DefaultDependencyLoader,
  IDependencyLoaderResult,
  DependencyLoaderFactoryProvider,
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
  MarkupElementExpression,
  MarkupCommentExpression,
  MarkupAttributeExpression,
  MarkupFragmentExpression,
  serializeMarkupExpression,
  deserializeMarkupExpression,
  ElementTextContentMimeTypeProvider,
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

    const self = this;


    const expression = parseMarkup(String(content));
    const imports: string[] = [];
    const dirname = path.dirname(uri);

    const sourceNode = (await expression.accept({
      visitAttribute({ name, value, location }: MarkupAttributeExpression) {

        if (/src|href/.test(name) && !hasProtocol(value)) {
          if (value.charAt(0) === "/") {
            value = "file://" + value;
          } else {
            value = dirname.replace(/^\w+:\/\//g, "") + "/" + value;
          }
          if (!hasProtocol(value)) {
            value = "file://" + value;
          }
          imports.push(value);
        }
        
        return new sm.SourceNode(location.start.line, location.start.column, uri, [" ", name, `="`, value,`"`]);
      },
      async visitElement(expression: MarkupElementExpression) {

        const { nodeName, attributes, childNodes, location } = expression;

        const buffer: (string | sm.SourceNode)[] | string | sm.SourceNode = [
          `<` + nodeName,
          ...(await Promise.all(attributes.map(attrib => attrib.accept(this)))),
          `>`
        ];

        const textMimeType = ElementTextContentMimeTypeProvider.lookup(expression, self._injector);
        const textLoaderProvider = textMimeType && DependencyLoaderFactoryProvider.find(textMimeType, self._injector);


        if (textLoaderProvider && expression.childNodes.length) {
          const textLoader = textLoaderProvider.create(self.strategy);

          const firstChild = expression.childNodes[0] as MarkupTextExpression;
          const lines = Array.from({ length: firstChild.location.start.line - 1 }).map(() => "\n").join("");

          const textResult = await textLoader.load({ uri, hash }, { 
            type: textMimeType, 
            content: lines + firstChild.nodeValue
          });

          let textContent = textResult.content;

          if (textResult.map) {
            const sourceMappingURL = `data:application/json;base64,${new Buffer(JSON.stringify(textResult.map)).toString("base64")}`;
            textContent += `/*# sourceMappingURL=${sourceMappingURL} */`;
          }

          buffer.push(new sm.SourceNode(firstChild.location.start.line, firstChild.location.start.column, uri, textContent));

        } else {
          buffer.push(...(await Promise.all(childNodes.map(child => child.accept(this)))));
        }

        buffer.push(`</${nodeName}>`);
        return new sm.SourceNode(location.start.line, location.start.column, uri, buffer);
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