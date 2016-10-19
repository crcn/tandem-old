import {
  IBundleLoader,
  IBundleContent,
  IBundleLoaderResult
} from "@tandem/sandbox";

import { HTML_AST_MIME_TYPE } from "@tandem/html-extension/constants";

import {
  parseMarkup,
  MarkupTextExpression,
  MarkupFragmentExpression,
  serializeMarkupExpression,
  deserializeMarkupExpression,
} from "@tandem/synthetic-browser";

export class HTMLBundleLoader implements IBundleLoader {
  async load({ type, value }): Promise<IBundleLoaderResult> {

    const dependencyPaths = [];

    const ast = parseMarkup(value);

    ast.accept({
      visitAttribute({ name, value, parent }) {

        // ignore redirecting tag names
        if (/src|href/.test(name) && !/a/i.test(parent.nodeName)) {
          dependencyPaths.push(value);
        }
      },
      visitComment(comment) { },
      visitText() { },
      visitDocumentFragment(fragment) {
        return fragment.childNodes.forEach((child) => child.accept(this));
      },
      visitElement(element) {
        element.attributes.forEach((attribute) => attribute.accept(this));
        element.childNodes.forEach((child) => child.accept(this));

        // todo - transform content here
        if (/script|style/i.test(element.nodeName) && element.childNodes.length) {
          const textNode = element.childNodes[0] as MarkupTextExpression;
          // need to add source maps here
          // textNode.nodeValue = transformBundleContent(bundle, textNode.nodeValue);
        }
      }
    });

    return {
      type:  HTML_AST_MIME_TYPE,
      value: ast,
      dependencyPaths: dependencyPaths
    };
  }
}