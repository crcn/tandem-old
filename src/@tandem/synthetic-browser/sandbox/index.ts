import { Action, spliceChunk, getChunk } from "@tandem/common";
import {
  parseMarkup,
  evaluateMarkup,
  SyntheticWindow,
  SyntheticDOMNode,
  MarkupExpression,
  SyntheticDOMElement,
  MarkupNodeExpression,
  formatMarkupExpression,
  MarkupElementExpression,
  MarkupFragmentExpression,
} from "../dom";

import {
  IModule,
  BaseModule,
  IModuleEdit,
  IModuleEditor,
  BaseModuleEdit,
  BaseModuleEditor,
  RemoveSyntheticAction,
  ModuleFactoryDependency,
} from "@tandem/sandbox";

export interface IMarkupModule extends IModule {
  readonly editor: IMarkupEditor;
}

export class MarkupModule extends BaseModule implements IMarkupModule {
  readonly editor: IMarkupEditor;
  public ast: MarkupFragmentExpression;

  createEditor() {
    return new MarkupEditor(this);
  }
  compile() {
    return Promise.resolve(() => {
      return evaluateMarkup(this.ast = parseMarkup(this.content), (<SyntheticWindow>this.sandbox.global).document, null);
    });
  }
}

export interface IMarkupEdit extends IModuleEdit {
  setElementAttribute(element: SyntheticDOMElement, name: string, value: string);
  appendChildNode(parent: SyntheticDOMElement, child: SyntheticDOMNode);
}

export interface IMarkupEditor extends IModuleEditor {
  edit(onEdit: (edit: IMarkupEdit) => any);
}

export class SetElementAttributeAction extends Action {
  static readonly SET_ELEMENT_ATTRIBUTE = "setElementAttribute";
  constructor(readonly item: SyntheticDOMElement, readonly name: string, readonly value: string) {
    super(SetElementAttributeAction.SET_ELEMENT_ATTRIBUTE);
  }
}

export class AppendChildNodeAction extends Action {
  static readonly APPEND_CHILD_NODE = "appendChildNode";
  constructor(readonly parent: SyntheticDOMElement, readonly child: SyntheticDOMNode) {
    super(AppendChildNodeAction.APPEND_CHILD_NODE);
  }
}

export class MarkupEdit extends BaseModuleEdit implements IMarkupEdit {
  setElementAttribute(element, name, value) {
    this.actions.push(new SetElementAttributeAction(element, name, value));
  }
  appendChildNode(parent: SyntheticDOMElement, child: SyntheticDOMNode) {
    this.actions.push(new AppendChildNodeAction(parent, child));
  }
}

export class MarkupEditor extends BaseModuleEditor<MarkupEdit> implements IMarkupEditor {
  createEdit(): MarkupEdit {
    return new MarkupEdit();
  }

  getFormattedContent() {
    return formatMarkupExpression((<MarkupModule>this.module).ast);
  }

  [SetElementAttributeAction.SET_ELEMENT_ATTRIBUTE](action: SetElementAttributeAction) {
    (<MarkupElementExpression>action.item.expression).setAttributeValue(action.name, action.value);
  }

  [AppendChildNodeAction.APPEND_CHILD_NODE](action: AppendChildNodeAction) {
    (<MarkupElementExpression>action.parent.expression).appendChild(parseMarkup(action.child.toString()));
  }

  removeSynthetic(action: RemoveSyntheticAction) {
    (<MarkupNodeExpression>action.item.expression).parent.removeChild(action.item.expression);
  }
}
