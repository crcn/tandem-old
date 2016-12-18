import { ICommand, inject, KernelProvider, Kernel } from "@tandem/common";
import { IMessage } from "@tandem/mesh";
import { SyntheticDOMNode, DOMNodeType, SyntheticDocument, SVG_XMLNS, HTML_XMLNS } from "@tandem/synthetic-browser";
import { EditorStore } from "@tandem/editor/browser/stores";
import { HTMLExtensionStore, MergedCSSStyleRule  } from "@tandem/html-extension/editor/browser/stores";
import { HTMLExtensionStoreProvider  } from "@tandem/html-extension/editor/browser/providers";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { MetadataKeys } from "@tandem/editor/browser/constants";

export class UpdateMergedRuleCommand implements ICommand {
  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

  @inject(HTMLExtensionStoreProvider.ID)
  private _htmlStore: HTMLExtensionStore;


  @inject(KernelProvider.ID)
  private _kernel: Kernel;

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
        try {
          this._htmlStore.mergedStyleRule = this._kernel.inject(new MergedCSSStyleRule(item as any));
        } catch(e) {
          console.error(e.stack);
        }
      } 
    }
  }
}