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
  IModuleEdit,
  IModuleEditor,
  BaseSandboxModule,
  RemoveSyntheticAction,
  BaseSandboxModuleEdit,
  BaseSandboxModuleEditor,
  SandboxModuleFactoryDependency,
} from "@tandem/sandbox";

import { MarkupMimeTypeXMLNSDependency } from "../dependencies";

export interface IMarkupModule extends IModule {
  readonly editor: IMarkupEditor;
}

export class MarkupModule extends BaseSandboxModule implements IMarkupModule {
  readonly editor: IMarkupEditor;
  public ast: MarkupFragmentExpression;

  createEditor() {
    return new MarkupEditor(this);
  }
  compile() {
    return Promise.resolve(() => {
      const window = <SyntheticWindow>this.sandbox.global;
      return evaluateMarkup(this.ast = parseMarkup(this.content), window.document, MarkupMimeTypeXMLNSDependency.lookup(this.fileName, window.browser.dependencies));
    });
  }
}

export interface IMarkupEdit extends IModuleEdit {
  setElementAttribute(element: SyntheticDOMElement, name: string, value: string);
  removeElementAttribute(element: SyntheticDOMElement, name: string);
  appendChildNode(parent: SyntheticDOMElement, child: SyntheticDOMNode);
  appendChildNode(parent: SyntheticDOMElement, child: SyntheticDOMNode);
}

export interface IHTMLEdit extends IMarkupEdit {
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

export class RemoveElementAttributeAction extends Action {
  static readonly REMOVE_ELEMENT_ATTRIBUTE = "removeElementAttribute";
  constructor(readonly item: SyntheticDOMElement, readonly name: string) {
    super(RemoveElementAttributeAction.REMOVE_ELEMENT_ATTRIBUTE);
  }
}

export class AppendChildNodeAction extends Action {
  static readonly APPEND_CHILD_NODE = "appendChildNode";
  constructor(readonly parent: SyntheticDOMElement, readonly child: SyntheticDOMNode) {
    super(AppendChildNodeAction.APPEND_CHILD_NODE);
  }
}

export class MarkupEdit extends BaseSandboxModuleEdit implements IMarkupEdit {
  setElementAttribute(element, name, value) {
    this.actions.push(new SetElementAttributeAction(element, name, value));
  }
  removeElementAttribute(element, name) {
    this.actions.push(new RemoveElementAttributeAction(element, name));
  }
  appendChildNode(parent: SyntheticDOMElement, child: SyntheticDOMNode) {
    this.actions.push(new AppendChildNodeAction(parent, child));
  }
}

export class MarkupEditor extends BaseSandboxModuleEditor<MarkupEdit> implements IMarkupEditor {
  createEdit(): MarkupEdit {
    return new MarkupEdit();
  }

  getFormattedContent() {
    return formatMarkupExpression((<MarkupModule>this.module).ast);
  }

  [SetElementAttributeAction.SET_ELEMENT_ATTRIBUTE](action: SetElementAttributeAction) {
    (<MarkupElementExpression>action.item.expression).setAttribute(action.name, action.value);
  }

  [RemoveElementAttributeAction.REMOVE_ELEMENT_ATTRIBUTE](action: SetElementAttributeAction) {
    (<MarkupElementExpression>action.item.expression).removeAttribute(action.name);
  }

  [AppendChildNodeAction.APPEND_CHILD_NODE](action: AppendChildNodeAction) {
    (<MarkupElementExpression>action.parent.expression).appendChild(parseMarkup(action.child.toString()));
  }

  removeSynthetic(action: RemoveSyntheticAction) {
    (<MarkupNodeExpression>action.item.expression).parent.removeChild(action.item.expression);
  }
}
