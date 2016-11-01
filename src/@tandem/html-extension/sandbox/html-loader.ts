import * as path from "path";

import {
  Dependency,
  IDependencyLoader,
  BaseDependencyLoader,
  IDependencyContent,
  DefaultBundleLoader,
  IDependencyLoaderResult,
} from "@tandem/sandbox";

import {
  inject,
  Injector,
  HTML_MIME_TYPE,
  InjectorProvider,
} from "@tandem/common";

import {
  parseMarkup,
  SyntheticDOMElement,
  MarkupTextExpression,
  formatMarkupExpression,
  MarkupFragmentExpression,
  serializeMarkupExpression,
  deserializeMarkupExpression,
} from "@tandem/synthetic-browser";

export class HTMLBundleLoader extends BaseDependencyLoader {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async load(filePath, { type, content }): Promise<IDependencyLoaderResult> {

    const dependencyPaths = [];
    const injector = this._injector;
    const self = this;

    const ast = parseMarkup(content);

    await ast.accept({
      visitAttribute: async ({ name, value, parent })  => {
        // ignore redirecting tag names
        if (/src|href/.test(name) && !/^a$/i.test(parent.nodeName)) {
          const absoluteFilePathOptions = await this.strategy.resolve(value, path.dirname(filePath));
          (<SyntheticDOMElement>parent).setAttribute(name, absoluteFilePathOptions.filePath);
          dependencyPaths.push(value);
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

        // normalize scripts here so that we just have text/javascript and text/css
        // TODO - add source maps here.
        if (/script|style/i.test(element.nodeName) && element.childNodes.length) {
          const textNode = element.childNodes[0] as MarkupTextExpression;
          const type     = element.getAttribute("type");

          if (type) {

            const result = await self.strategy.getLoader(null).load(filePath, {
              type: type,
              content: textNode.nodeValue
            });

            textNode.nodeValue = result.content;
            element.setAttribute("type", result.type);
          }
        }

        return Promise.all([...element.childNodes, ...element.attributes].map((child) => {
          return child.accept(this);
        }));
      }
    });
    return {
      ast: ast,
      type: HTML_MIME_TYPE,
      content: formatMarkupExpression(ast),
      dependencyPaths: dependencyPaths
    };
  }
}