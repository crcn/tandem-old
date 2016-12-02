import { ICommand, inject, InjectorProvider, Injector } from "@tandem/common";
import { IMessage } from "@tandem/mesh";
import { SyntheticDOMNode, DOMNodeType, SyntheticDocument, SVG_XMLNS, HTML_XMLNS } from "@tandem/synthetic-browser";
import { Store } from "@tandem/editor/browser/stores";
import { HTMLExtensionStore, MergedCSSStyleRule  } from "@tandem/html-extension/editor/browser/stores";
import { HTMLExtensionStoreProvider  } from "@tandem/html-extension/editor/browser/providers";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { MetadataKeys } from "@tandem/editor/browser/constants";

export class UpdateMergedRuleCommand implements ICommand {
  @inject(EditorStoreProvider.ID)
  private _store: Store;

  @inject(HTMLExtensionStoreProvider.ID)
  private _htmlStore: HTMLExtensionStore;


  @inject(InjectorProvider.ID)
  private _injector: Injector;

  execute(message: IMessage) {
    if (this._htmlStore.mergedStyleRule) {
      this._htmlStore.mergedStyleRule.dispose();
    }
    this._htmlStore.mergedStyleRule = undefined;
    if (!this._store.workspace) return;
    const selection = this._store.workspace.selection;
    if (selection.length === 1) {
      const item = selection[0] as SyntheticDOMNode;
      if ([SVG_XMLNS, HTML_XMLNS].indexOf(item.namespaceURI) !== -1) {
        this._htmlStore.mergedStyleRule = this._injector.inject(new MergedCSSStyleRule(item as any));
      } 
    }
  }
}