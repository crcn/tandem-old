import {
  loadBundleContent,
  IBundleLoader,
  IBundleContent,
  IBundleLoaderResult,
} from "@tandem/sandbox";

import {
  inject,
  Dependencies,
  HTML_MIME_TYPE,
  DependenciesDependency,
} from "@tandem/common";

import {
  parseMarkup,
  MarkupTextExpression,
  MarkupFragmentExpression,
  formatMarkupExpression,
  serializeMarkupExpression,
  deserializeMarkupExpression,
} from "@tandem/synthetic-browser";

export class TandemBundleLoader implements IBundleLoader {

  @inject(DependenciesDependency.NS)
  private _dependencies: Dependencies;

  async load(bundle, { type, content }): Promise<IBundleLoaderResult> {

    const dependencyPaths = [];
    const dependencies = this._dependencies;

    const ast = parseMarkup(content);

    await ast.accept({
      visitAttribute({ name, value, parent }) {
        // ignore redirecting tag names
        if (/src|href/.test(name) && !/^a$/i.test(parent.nodeName)) {
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
            const result = await loadBundleContent(bundle, {
              type: type,
              content: textNode.nodeValue
            }, dependencies);

            const [name, subtype] = result.type.split("/");
            let newType = result.type;
            let newValue = result.content;

            // Dirty. This assumes that
            // a: subtype is correct for the parent element
            // b: toString() works for result.value
            // TODO - need to have an appropriate content transformer here
            // ContentTransformerDependency.transform(type, MimeTypeDependency.lookup(element.nodeName))
            if (typeof result.content !== "string") {
              newType  = "text/" + subtype;
              newValue = result.content.toString();
            }

            textNode.nodeValue = newValue;
            element.setAttribute("type", newType);
          }
        }

        return Promise.all([...element.childNodes, ...element.attributes].map((child) => {
          return child.accept(this);
        }));
      }
    });
    return {
      type: HTML_MIME_TYPE,
      content: formatMarkupExpression(ast),
      dependencyPaths: dependencyPaths
    };
  }
}