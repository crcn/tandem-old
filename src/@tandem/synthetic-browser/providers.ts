import { SyntheticBrowser } from "./browser";
import { RemoteBrowserService } from "./remote-browser";
import { syntheticElementClassType, SyntheticDOMNode } from "./dom";
import { Provider, Injector, MimeTypeProvider, ApplicationServiceProvider } from "@tandem/common";

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

  static findAll(injector: Injector) {
    return injector.queryAll<SyntheticDOMElementClassProvider>([this.SYNTHETIC_ELEMENT_CLASS_NS, "**"].join("/"));
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
  static lookup(path: string, injector: Injector): string {
    const mimeType = MimeTypeProvider.lookup(path, injector);
    const provider = injector.query<MarkupMimeTypeXMLNSProvider>(this.getNamespace(mimeType));
    return provider && provider.value;
  }
}


export class CSSSyntaxProvider extends Provider<Function> {
  static readonly NS = "cssSyntax";
  constructor(readonly mimeType: string, readonly syntax: Function) {
    super(CSSSyntaxProvider.getId(mimeType), syntax);
  }
  static getId(mimeType: string) {
    return [this.NS, mimeType].join("/");
  }
  static find(mimeType: string, injector: Injector): Function {
    const provider = injector.query<CSSSyntaxProvider>(this.getId(mimeType))
    return provider && provider.value ;
  }
}