import {
  Action,
  bindable,
  Injector,
  BubbleBus,
  diffArray,
  serialize,
  ISerializer,
  deserialize,
  ITreeWalker,
  serializable,
  TreeNodeAction,
  ISerializedContent,
  ObservableCollection,
} from "@tandem/common";

import {
  DOMNodeType,
  SyntheticDOMText,
  SyntheticDOMNode,
  IMarkupNodeVisitor,
  SyntheticDOMElement,
  SyntheticDOMComment,
  SyntheticDOMContainer,
  SyntheticDOMValueNode,
  SyntheticDOMContainerEdit,
  syntheticElementClassType,
  SyntheticDocumentFragment,
  SyntheticDOMNodeSerializer,
} from "./markup";

import {
  EditAction,
  RemoveEditAction,
  MoveChildEditAction,
  ApplicableEditAction,
  RemoveChildEditAction,
  InsertChildEditAction,
} from "@tandem/sandbox";

import { SyntheticWindow } from "./window";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticCSSStyleSheet } from "./css";

export interface IRegisterComponentOptions {
  prototype: any;
  extends: string;
}

export interface ISerializedSyntheticDocument {
  styleSheets: any[];
  defaultNamespaceURI: string;
  childNodes: any[];
}

class SyntheticDocumentSerializer implements ISerializer<SyntheticDocument, ISerializedSyntheticDocument> {
  serialize(document: SyntheticDocument) {
    return {
      // need to cast style sheet to vanilla array before mapping
      styleSheets: [].concat(document.styleSheets).map(serialize),
      defaultNamespaceURI: document.defaultNamespaceURI,
      childNodes: document.childNodes.map(serialize),
    };
  }
  deserialize(value: ISerializedSyntheticDocument, injector) {
    const document = new SyntheticDocument(value.defaultNamespaceURI);
    document.styleSheets.push(...value.styleSheets.map(raw => deserialize(raw, injector)));
    for (let i = 0, n = value.childNodes.length; i < n; i++) {
      document.appendChild(deserialize(value.childNodes[i], injector));
    }
    return document;
  }
}

// TODO - this shouldn't be here
@serializable({
  serialize({ actions }: SyntheticDocumentEdit) {
    return {
      actions: actions.map(serialize)
    };
  },
  deserialize({ actions }, injector, ctor: { new(): SyntheticDocumentEdit }) {
    const edit = new ctor();
    edit.actions.push(...actions.map(action => deserialize(action, injector)));
    return edit;
  }
})
export class SyntheticDocumentEdit extends SyntheticDOMContainerEdit<SyntheticDocument> {

  static readonly ADD_DOCUMENT_STYLE_SHEET_EDIT    = "addDocumentStyleSheetEdit";
  static readonly REMOVE_DOCUMENT_STYLE_SHEET_EDIT = "removeDocumentStyleSheetEdit";
  static readonly MOVE_DOCUMENT_STYLE_SHEET_EDIT   = "moveDocumentStyleSheetEdit";;

  addStyleSheet(stylesheet: SyntheticCSSStyleSheet) {
    return this.addAction(new InsertChildEditAction(SyntheticDocumentEdit.ADD_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet));
  }

  removeStyleSheet(stylesheet: SyntheticCSSStyleSheet) {
    return this.addAction(new RemoveChildEditAction(SyntheticDocumentEdit.REMOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet));
  }

  moveStyleSheet(stylesheet: SyntheticCSSStyleSheet, newIndex: number) {
    return this.addAction(new MoveChildEditAction(SyntheticDocumentEdit.MOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, newIndex));
  }

  protected addDiff(newDocument: SyntheticDocument) {

    diffArray(this.target.styleSheets, newDocument.styleSheets, (oldStyleSheet, newStyleSheet) => {

      if (oldStyleSheet.source && newStyleSheet.source) {
        return oldStyleSheet.source.filePath === newStyleSheet.source.filePath ? 0 : -1;
      }

      // may be very, very expensive...
      return oldStyleSheet.createEdit().fromDiff(newStyleSheet).actions.length;
    }).accept({
      visitInsert: ({ index, value }) => {
        this.addStyleSheet(value);
      },
      visitRemove: ({ index }) => {
        this.removeStyleSheet(this.target.styleSheets[index]);
      },
      visitUpdate: ({ originalOldIndex, patchedOldIndex, newValue, newIndex }) => {
        if (patchedOldIndex !== newIndex) {
          this.moveStyleSheet(this.target.styleSheets[originalOldIndex], newIndex);
        }
        this.addChildEdit(this.target.styleSheets[originalOldIndex].createEdit().fromDiff(newValue));
      }
    });

    return super.addDiff(newDocument);
  }
}

@serializable(new SyntheticDOMNodeSerializer(new SyntheticDocumentSerializer()))
export class SyntheticDocument extends SyntheticDOMContainer {
  readonly nodeType: number = DOMNodeType.DOCUMENT;
  readonly styleSheets: SyntheticCSSStyleSheet[];
  private _registeredElements: any;
  public $window: SyntheticWindow;

  // namespaceURI here is non-standard, but that's
  constructor(readonly defaultNamespaceURI: string) {
    super("#document");
    this.styleSheets = [];
    this._registeredElements = {};
  }

  get browser(): ISyntheticBrowser {
    return this.$window.browser;
  }

  get defaultView(): SyntheticWindow {
    return this.$window;
  }

  get documentElement(): SyntheticDOMElement {
    return this.childNodes[0] as SyntheticDOMElement;
  }

  get head(): SyntheticDOMElement {
    return this.documentElement.childNodes[0] as SyntheticDOMElement;
  }

  get body(): SyntheticDOMElement {
    return this.documentElement.childNodes[1] as SyntheticDOMElement;
  }

  get location(): SyntheticLocation {
    return this.$window.location;
  }

  set location(value: SyntheticLocation) {
    this.$window.location = value;
  }

  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitDocument(this);
  }

  createElementNS(ns: string, tagName: string): SyntheticDOMElement {
    const nsElements = this._registeredElements[ns] || {};
    const elementClass = this.$getElementClassNS(ns, tagName);
    const element = this.own(new elementClass(ns, tagName));
    element.$createdCallback();
    return element;
  }

  $getElementClassNS(ns: string, tagName: string): syntheticElementClassType {
    const nsElements = this._registeredElements[ns] || {};
    const elementClass = nsElements[tagName.toLowerCase()] || nsElements.default || SyntheticDOMElement;
    return elementClass;
  }

  createEdit(): SyntheticDocumentEdit {
    return new SyntheticDocumentEdit(this);
  }

  createElement(tagName: string) {
    return this.own(this.createElementNS(this.defaultNamespaceURI, tagName));
  }

  registerElement(tagName: string, elementClass: syntheticElementClassType);
  registerElement(tagName: string, options: IRegisterComponentOptions);

  registerElement(tagName: string, options: any): syntheticElementClassType {
    return this.registerElementNS(this.defaultNamespaceURI, tagName, options);
  }

  applyEditAction(action: EditAction) {
    super.applyEditAction(action);

    const target: any = {
      [SyntheticDocumentEdit.REMOVE_DOCUMENT_STYLE_SHEET_EDIT]: this.styleSheets,
      [SyntheticDocumentEdit.ADD_DOCUMENT_STYLE_SHEET_EDIT]: this.styleSheets,
      [SyntheticDocumentEdit.MOVE_DOCUMENT_STYLE_SHEET_EDIT]: this.styleSheets
    }[action.type];

    if (target) {
      (<ApplicableEditAction>action).applyTo(target);
    }
  }

  // non-standard APIs to enable custom elements according to the doc type -- necessary for
  // cases where we're mixing different template engines such as angular, vuejs, etc.
  registerElementNS(ns: string, tagName: string, elementClass: syntheticElementClassType);
  registerElementNS(ns: string, tagName: string, options: IRegisterComponentOptions);

  registerElementNS(ns: string, tagName: string, options: any): syntheticElementClassType {
    if (!this._registeredElements[ns]) {
      this._registeredElements[ns] = {};
    }
    return this._registeredElements[ns][tagName.toLowerCase()] = typeof options === "function" ? options : createElementClass(options);
  }

  createComment(nodeValue: string) {
    return this.own(new SyntheticDOMComment(nodeValue));
  }

  createTextNode(nodeValue: string) {
    return this.own(new SyntheticDOMText(nodeValue));
  }

  createDocumentFragment() {
    return this.own(new SyntheticDocumentFragment());
  }

  visitWalker(walker: ITreeWalker) {
    this.styleSheets.forEach(styleSheet => walker.accept(styleSheet));
    super.visitWalker(walker);
  }

  onChildAdded(child) {
    super.onChildAdded(child);
    this.own(child);
  }

  cloneShallow() {
    return new SyntheticDocument(this.defaultNamespaceURI);
  }

  public $linkClone(clone: SyntheticDocument) {
    clone.$window = this.defaultView;
    return super.$linkClone(clone);
  }

  private own<T extends SyntheticDOMNode>(node: T) {
    node.$setOwnerDocument(this);
    return node;
  }
}

function createElementClass(options: IRegisterComponentOptions): syntheticElementClassType {
  return class extends SyntheticDOMElement {
    // TODO
  };
}