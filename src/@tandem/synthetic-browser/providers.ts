import { SyntheticBrowser } from "./browser";
import { RemoteBrowserService } from "./remote-browser";
import { syntheticElementClassType, SyntheticDOMNode } from "./dom";
import parse5 = require("parse5");
import { Provider, Kernel, MimeTypeProvider, ApplicationServiceProvider } from "@tandem/common";

export class SyntheticDOMElementClassProvider extends Provider<syntheticElementClassType> {
  static readonly SYNTHETIC_ELEMENT_CLASS_NS = "syntheticMarkupElementClass";

  constructor(readonly xmlns: string, readonly tagName: string, value: syntheticElementClassType) {
    super(SyntheticDOMElementClassProvider.getNamespace(xmlns, tagName), value);
  }

  clone() {
    return new SyntheticDOMElementClassProvider(this.xmlns, this.tagName, this.value);
  }

  static getNamespace(xmlns: string, tagName: string) {
    return [this.SYNTHETIC_ELEMENT_CLASS_NS, encodeURIComponent(xmlns), tagName].join("/");
  }

  static findAll(kernel: Kernel) {
    return kernel.queryAll<SyntheticDOMElementClassProvider>([this.SYNTHETIC_ELEMENT_CLASS_NS, "**"].join("/"));
  }
}

export class MarkupMimeTypeXMLNSProvider extends Provider<string> {
  static readonly MARKUP_MIME_TYPE_XMLNS = "markupMimeTypeXMLNS";
  constructor(readonly mimeType: string, readonly xmlns: string) {
    super(MarkupMimeTypeXMLNSProvider.getNamespace(mimeType), xmlns);
  }
  static getNamespace(mimeType: string) {
    return [this.MARKUP_MIME_TYPE_XMLNS, mimeType].join("/");
  }
  static lookup(path: string, kernel: Kernel): string {
    const mimeType = MimeTypeProvider.lookup(path, kernel);
    const provider = kernel.query<MarkupMimeTypeXMLNSProvider>(this.getNamespace(mimeType));
    return provider && provider.value;
  }
}

export type ElementTextContentMimeTypeGetter = (element: parse5.AST.Default.Node) => string;

export class ElementTextContentMimeTypeProvider extends Provider<ElementTextContentMimeTypeGetter> {
  static readonly NS = "elementTetContentMimeTypes";
  constructor(readonly tagName: string, readonly getter: ElementTextContentMimeTypeGetter) {
    super(ElementTextContentMimeTypeProvider.getId(tagName.toLowerCase()), getter);
  }
  clone() {
    return new ElementTextContentMimeTypeProvider(this.tagName, this.getter);
  }
  static getId(tagName: string) {
    return [this.NS, tagName].join("/");
  }
  static lookup(element: parse5.AST.Default.Node, kernel: Kernel) {
    const provider = kernel.query<ElementTextContentMimeTypeProvider>(this.getId(element.nodeName.toLowerCase()));
    return provider && provider.getter(element);
  }
}
