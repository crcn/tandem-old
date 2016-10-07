import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";
import { evaluateMarkup, parseMarkup, SyntheticWindow, ISyntheticMarkupNodeEditor } from "../dom";
import { spliceChunk, getChunk, BaseSyntheticEditor, SyntheticEditAction, RemoveSyntheticEditAction } from "@tandem/common";

export class MarkupModule extends BaseModule {
  private _editor: ISyntheticMarkupNodeEditor;

  initialize() {
    super.initialize();
    this._editor = new MarkupEditor(this);
  }

  async evaluate() {
    return evaluateMarkup(parseMarkup(this.content), (<SyntheticWindow>this.sandbox.global).document, null, this._editor);
  }
}

class MarkupEditor extends BaseSyntheticEditor implements ISyntheticMarkupNodeEditor {
  constructor(readonly module: MarkupModule) {
    super();
    this.module = module;
  }

  applyEdits(actions: SyntheticEditAction[]) {
    let content = this.module.content;
    for (const action of actions) {
      if (action.type === RemoveSyntheticEditAction.REMOVE_SYNTHETIC) {
        content = this.remove(content, action);
      }
    }

    this.module.content = content;
  }

  remove(content: string, action: RemoveSyntheticEditAction) {

    // TODO - remove whitespace before node
    const chunk = getChunk(content, action.item.expression.position);
    content = spliceChunk(content, "", action.item.expression.position);
    return content;
  }
}
