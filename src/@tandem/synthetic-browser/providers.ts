import { SyntheticBrowser } from "./browser";
import { RemoteBrowserService } from "./remote-browser";
import { syntheticElementClassType, SyntheticDOMNode } from "./dom";
import { Provider, Dependencies, MimeTypeProvider, ApplicationServiceProvider } from "@tandem/common";

export class SyntheticDOMElementClassProvider extends Provider<syntheticElementClassType> {
  static readonly SYNTHETIC_ELEMENT_CLASS_NS_PREFIX = "syntheticMarkupElementClass";

  constructor(readonly xmlns: string, readonly tagName: string, value: syntheticElementClassType) {
    super(SyntheticDOMElementClassProvider.getNamespace(xmlns, tagName), value);
  }

  clone() {
    return new SyntheticDOMElementClassProvider(this.xmlns, this.tagName, this.value);
  }

  static getNamespace(xmlns: string, tagName: string) {
    return [this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, encodeURIComponent(xmlns), tagName].join("/");
  }

  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<SyntheticDOMElementClassProvider>([this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, "**"].join("/"));
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
  static lookup(path: string, dependencies: Dependencies): string {
    const mimeType = MimeTypeProvider.lookup(path, dependencies);
    const dependency = dependencies.query<MarkupMimeTypeXMLNSProvider>(this.getNamespace(mimeType));
    return dependency && dependency.value;
  }
}

/**
 * Casts vanilla objects as synthetic DOM nodes. Used to mount library components such as
 * React, Vue, Ember, Angular, and others.
 */

export interface IMarkupDOMCaster {
  cast(object: any, browser: SyntheticBrowser): Promise<SyntheticDOMNode>|SyntheticDOMNode;
}

export class SyntheticDOMCasterProvider extends Provider<IMarkupDOMCaster> {
  static readonly MARKUP_DOM_CASTER_NS = "markupDOMCaster";
  constructor(id: string, value: IMarkupDOMCaster) {
    super(SyntheticDOMCasterProvider.getNamespace(id), value);
  }

  static getNamespace(id: string) {
    return [this.MARKUP_DOM_CASTER_NS, id].join("/");
  }

  static async castAsDOMNode(object: any, browser: SyntheticBrowser, dependencies: Dependencies): Promise<SyntheticDOMNode> {
    for (const dep of dependencies.queryAll<SyntheticDOMCasterProvider>(this.getNamespace("**"))) {
      const ret = await dep.value.cast(object, browser);
      if (ret instanceof SyntheticDOMNode) return ret;
    }
    return undefined;
  }
}
