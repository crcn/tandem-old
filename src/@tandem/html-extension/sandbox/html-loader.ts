import { IBundleLoader, IBundleLoaderResult } from "@tandem/sandbox";
import { parseMarkup, MarkupFragmentExpression } from "@tandem/synthetic-browser";

export class HTMLBundleResult implements IBundleLoaderResult {

  constructor(readonly ast: MarkupFragmentExpression) { }

  get dependencyPaths() {

    const dependencyPaths = [];

    this.ast.accept({
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
      }
    });

    return dependencyPaths;
  }
}

export class HTMLBundleLoader implements IBundleLoader {
  async load(content: string): Promise<IBundleLoaderResult> {
    return new HTMLBundleResult(parseMarkup(content));
  }
}