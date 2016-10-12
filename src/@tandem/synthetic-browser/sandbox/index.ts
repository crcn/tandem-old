import { Action, spliceChunk, getChunk } from "@tandem/common";
import {
  parseMarkup,
  evaluateMarkup,
  SyntheticWindow,
  SyntheticDOMNode,
  MarkupExpression,
  SyntheticDocument,
  SyntheticDOMElement,
  MarkupNodeExpression,
  formatMarkupExpression,
  MarkupElementExpression,
  MarkupFragmentExpression,
  MarkupContainerExpression,
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
    this.ast = parseMarkup(this.content);
    return () => this.evaluateMarkup(this.ast, this.sandbox.global, MarkupMimeTypeXMLNSDependency.lookup(this.fileName, this.sandbox.global.browser.dependencies));
  }

  protected evaluateMarkup(ast: MarkupNodeExpression, window: SyntheticWindow, xmlns: string) {
    return evaluateMarkup(this.ast, window.document, xmlns);
  }
}

export interface IMarkupEdit extends IModuleEdit {
  setElementAttribute(element: SyntheticDOMElement, name: string, value: string);
  removeElementAttribute(element: SyntheticDOMElement, name: string);
  appendChildNode(child: SyntheticDOMNode, parent?: SyntheticDOMElement);
  insertChildBefore(newNode: SyntheticDOMNode, referenceNode: SyntheticDOMNode);
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

export class InsertChildNodeBeforeAction extends Action {
  static readonly INSERT_CHILD_NODE_BEFORE = "insertChildNodeBefore";
  constructor(readonly child: SyntheticDOMNode, readonly referenceNode: SyntheticDOMNode) {
    super(InsertChildNodeBeforeAction.INSERT_CHILD_NODE_BEFORE);
  }
}

export class MarkupEdit extends BaseSandboxModuleEdit implements IMarkupEdit {
  setElementAttribute(element, name, value) {
    this.actions.push(new SetElementAttributeAction(element, name, value));
  }
  removeElementAttribute(element, name) {
    this.actions.push(new RemoveElementAttributeAction(element, name));
  }
  appendChildNode(child: SyntheticDOMNode, parent?: SyntheticDOMElement) {
    this.actions.push(new AppendChildNodeAction(parent, child));
  }
  insertChildBefore(child: SyntheticDOMNode, referenceNode: SyntheticDOMNode) {
    this.actions.push(new InsertChildNodeBeforeAction(child, referenceNode));
  }
}

export class MarkupEditor extends BaseSandboxModuleEditor<MarkupEdit> implements IMarkupEditor {

  readonly module: MarkupModule;

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
    const parent = (action.parent ? action.parent.expression : this.module.ast) as MarkupContainerExpression;
    parent.appendChild(parseMarkup(action.child.toString()));
  }

  [InsertChildNodeBeforeAction.INSERT_CHILD_NODE_BEFORE](action: InsertChildNodeBeforeAction) {
    (<MarkupElementExpression>action.referenceNode.expression.parent).insertBefore(parseMarkup(action.child.toString()), action.referenceNode.expression);
  }

  removeSynthetic(action: RemoveSyntheticAction) {
    (<MarkupNodeExpression>action.item.expression).parent.removeChild(action.item.expression);
  }
}
