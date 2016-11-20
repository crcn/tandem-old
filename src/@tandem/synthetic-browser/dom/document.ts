import { CallbackDispatcher } from "@tandem/mesh";
import { SyntheticWindow } from "./window";
import { ISyntheticBrowser } from "../browser";
import { SyntheticLocation } from "../location";
import { SyntheticHTMLElement } from "./html";
import { SyntheticCSSStyleSheet } from "./css";

import {
  EditChange,
  RemoveEditChange,
  MoveChildEditChange,
  ApplicableEditChange,
  RemoveChildEditChange,
  InsertChildEditChange,
} from "@tandem/sandbox";

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
  Action,
  bindable,
  Injector,
  BubbleDispatcher,
  diffArray,
  serialize,
  ISerializer,
  deserialize,
  ITreeWalker,
  serializable,
  TreeNodeEvent,
  ISerializedContent,
  ArrayMetadataChangeEvent,
  ObservableCollection,
} from "@tandem/common";


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
  serialize({ changes }: SyntheticDocumentEdit) {
    return {
      changes: changes.map(serialize)
    };
  },
  deserialize({ changes }, injector, ctor: { new(): SyntheticDocumentEdit }) {
    const edit = new ctor();
    edit.changes.push(...changes.map(action => deserialize(action, injector)));
    return edit;
  }
})
export class SyntheticDocumentEdit extends SyntheticDOMContainerEdit<SyntheticDocument> {

  static readonly ADD_DOCUMENT_STYLE_SHEET_EDIT    = "addDocumentStyleSheetEdit";
  static readonly REMOVE_DOCUMENT_STYLE_SHEET_EDIT = "removeDocumentStyleSheetEdit";
  static readonly MOVE_DOCUMENT_STYLE_SHEET_EDIT   = "moveDocumentStyleSheetEdit";;

  addStyleSheet(stylesheet: SyntheticCSSStyleSheet) {
    return this.addChange(new InsertChildEditChange(SyntheticDocumentEdit.ADD_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet));
  }

  removeStyleSheet(stylesheet: SyntheticCSSStyleSheet) {
    return this.addChange(new RemoveChildEditChange(SyntheticDocumentEdit.REMOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet));
  }

  moveStyleSheet(stylesheet: SyntheticCSSStyleSheet, newIndex: number) {
    return this.addChange(new MoveChildEditChange(SyntheticDocumentEdit.MOVE_DOCUMENT_STYLE_SHEET_EDIT, this.target, stylesheet, newIndex));
  }

  protected addDiff(newDocument: SyntheticDocument) {

    diffArray(this.target.styleSheets, newDocument.styleSheets, (oldStyleSheet, newStyleSheet) => {

      if (oldStyleSheet.source && newStyleSheet.source) {
        return oldStyleSheet.source.filePath === newStyleSheet.source.filePath ? 0 : -1;
      }

      // may be very, very expensive...
      return oldStyleSheet.createEdit().fromDiff(newStyleSheet).changes.length;
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
  readonly styleSheets: ObservableCollection<SyntheticCSSStyleSheet>;
  private _registeredElements: any;
  public $window: SyntheticWindow;
  public $ownerNode: SyntheticDOMNode;

  // namespaceURI here is non-standard, but that's
  constructor(readonly defaultNamespaceURI: string) {
    super("#document");
    this.styleSheets = new ObservableCollection<SyntheticCSSStyleSheet>();
    this.styleSheets.observe(new CallbackDispatcher(this.onStyleSheetsAction.bind(this)));
    this._registeredElements = {};
  }

  get browser(): ISyntheticBrowser {
    return this.$window.browser;
  }

  get ownerNode(): SyntheticDOMNode {
    return this.$ownerNode;
  }

  get defaultView(): SyntheticWindow {
    return this.$window;
  }

  get documentElement(): SyntheticHTMLElement {
    return this.childNodes[0] as SyntheticHTMLElement;
  }

  get head(): SyntheticHTMLElement {
    return this.documentElement.childNodes[0] as SyntheticHTMLElement;
  }

  get body(): SyntheticHTMLElement {
    return this.documentElement.childNodes[1] as SyntheticHTMLElement;
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
  /*

  From http://www.w3schools.com/tags/

  execute the following script in console debugger if any elements change:

  console.log(Array.prototype.filter.call(document.querySelectorAll('a'), (element) => {
    return /^tag_/.test(element.getAttribute('href'));
  })
  .map((element) => {
    return element.innerText.replace(/>|</g, '');
  })
  .filter((tagName) => { return /^\w+$/.test(tagName); })
  .map((tagName) => {
    return `createElement(tagName: "${tagName}"): SyntheticHTMLElement;`;
  }).join("\n"));
  */

  createElement(tagName: "a"): SyntheticHTMLElement;
  createElement(tagName: "abbr"): SyntheticHTMLElement;
  createElement(tagName: "acronym"): SyntheticHTMLElement;
  createElement(tagName: "address"): SyntheticHTMLElement;
  createElement(tagName: "applet"): SyntheticHTMLElement;
  createElement(tagName: "area"): SyntheticHTMLElement;
  createElement(tagName: "article"): SyntheticHTMLElement;
  createElement(tagName: "aside"): SyntheticHTMLElement;
  createElement(tagName: "audio"): SyntheticHTMLElement;
  createElement(tagName: "b"): SyntheticHTMLElement;
  createElement(tagName: "base"): SyntheticHTMLElement;
  createElement(tagName: "basefont"): SyntheticHTMLElement;
  createElement(tagName: "bdi"): SyntheticHTMLElement;
  createElement(tagName: "bdo"): SyntheticHTMLElement;
  createElement(tagName: "big"): SyntheticHTMLElement;
  createElement(tagName: "blockquote"): SyntheticHTMLElement;
  createElement(tagName: "body"): SyntheticHTMLElement;
  createElement(tagName: "br"): SyntheticHTMLElement;
  createElement(tagName: "button"): SyntheticHTMLElement;
  createElement(tagName: "canvas"): SyntheticHTMLElement;
  createElement(tagName: "caption"): SyntheticHTMLElement;
  createElement(tagName: "center"): SyntheticHTMLElement;
  createElement(tagName: "cite"): SyntheticHTMLElement;
  createElement(tagName: "code"): SyntheticHTMLElement;
  createElement(tagName: "col"): SyntheticHTMLElement;
  createElement(tagName: "colgroup"): SyntheticHTMLElement;
  createElement(tagName: "datalist"): SyntheticHTMLElement;
  createElement(tagName: "dd"): SyntheticHTMLElement;
  createElement(tagName: "del"): SyntheticHTMLElement;
  createElement(tagName: "details"): SyntheticHTMLElement;
  createElement(tagName: "dfn"): SyntheticHTMLElement;
  createElement(tagName: "dialog"): SyntheticHTMLElement;
  createElement(tagName: "dir"): SyntheticHTMLElement;
  createElement(tagName: "dl"): SyntheticHTMLElement;
  createElement(tagName: "dt"): SyntheticHTMLElement;
  createElement(tagName: "em"): SyntheticHTMLElement;
  createElement(tagName: "embed"): SyntheticHTMLElement;
  createElement(tagName: "fieldset"): SyntheticHTMLElement;
  createElement(tagName: "figcaption"): SyntheticHTMLElement;
  createElement(tagName: "figure"): SyntheticHTMLElement;
  createElement(tagName: "font"): SyntheticHTMLElement;
  createElement(tagName: "footer"): SyntheticHTMLElement;
  createElement(tagName: "form"): SyntheticHTMLElement;
  createElement(tagName: "frame"): SyntheticHTMLElement;
  createElement(tagName: "frameset"): SyntheticHTMLElement;
  createElement(tagName: "head"): SyntheticHTMLElement;
  createElement(tagName: "header"): SyntheticHTMLElement;
  createElement(tagName: "hr"): SyntheticHTMLElement;
  createElement(tagName: "html"): SyntheticHTMLElement;
  createElement(tagName: "i"): SyntheticHTMLElement;
  createElement(tagName: "iframe"): SyntheticHTMLElement;
  createElement(tagName: "img"): SyntheticHTMLElement;
  createElement(tagName: "input"): SyntheticHTMLElement;
  createElement(tagName: "ins"): SyntheticHTMLElement;
  createElement(tagName: "kbd"): SyntheticHTMLElement;
  createElement(tagName: "keygen"): SyntheticHTMLElement;
  createElement(tagName: "label"): SyntheticHTMLElement;
  createElement(tagName: "legend"): SyntheticHTMLElement;
  createElement(tagName: "li"): SyntheticHTMLElement;
  createElement(tagName: "link"): SyntheticHTMLElement;
  createElement(tagName: "main"): SyntheticHTMLElement;
  createElement(tagName: "map"): SyntheticHTMLElement;
  createElement(tagName: "mark"): SyntheticHTMLElement;
  createElement(tagName: "menu"): SyntheticHTMLElement;
  createElement(tagName: "menuitem"): SyntheticHTMLElement;
  createElement(tagName: "meta"): SyntheticHTMLElement;
  createElement(tagName: "meter"): SyntheticHTMLElement;
  createElement(tagName: "nav"): SyntheticHTMLElement;
  createElement(tagName: "noframes"): SyntheticHTMLElement;
  createElement(tagName: "noscript"): SyntheticHTMLElement;
  createElement(tagName: "object"): SyntheticHTMLElement;
  createElement(tagName: "ol"): SyntheticHTMLElement;
  createElement(tagName: "optgroup"): SyntheticHTMLElement;
  createElement(tagName: "option"): SyntheticHTMLElement;
  createElement(tagName: "output"): SyntheticHTMLElement;
  createElement(tagName: "p"): SyntheticHTMLElement;
  createElement(tagName: "param"): SyntheticHTMLElement;
  createElement(tagName: "pre"): SyntheticHTMLElement;
  createElement(tagName: "progress"): SyntheticHTMLElement;
  createElement(tagName: "q"): SyntheticHTMLElement;
  createElement(tagName: "rp"): SyntheticHTMLElement;
  createElement(tagName: "rt"): SyntheticHTMLElement;
  createElement(tagName: "ruby"): SyntheticHTMLElement;
  createElement(tagName: "s"): SyntheticHTMLElement;
  createElement(tagName: "samp"): SyntheticHTMLElement;
  createElement(tagName: "script"): SyntheticHTMLElement;
  createElement(tagName: "section"): SyntheticHTMLElement;
  createElement(tagName: "select"): SyntheticHTMLElement;
  createElement(tagName: "small"): SyntheticHTMLElement;
  createElement(tagName: "source"): SyntheticHTMLElement;
  createElement(tagName: "span"): SyntheticHTMLElement;
  createElement(tagName: "strike"): SyntheticHTMLElement;
  createElement(tagName: "strong"): SyntheticHTMLElement;
  createElement(tagName: "style"): SyntheticHTMLElement;
  createElement(tagName: "sub"): SyntheticHTMLElement;
  createElement(tagName: "summary"): SyntheticHTMLElement;
  createElement(tagName: "sup"): SyntheticHTMLElement;
  createElement(tagName: "table"): SyntheticHTMLElement;
  createElement(tagName: "tbody"): SyntheticHTMLElement;
  createElement(tagName: "td"): SyntheticHTMLElement;
  createElement(tagName: "textarea"): SyntheticHTMLElement;
  createElement(tagName: "tfoot"): SyntheticHTMLElement;
  createElement(tagName: "th"): SyntheticHTMLElement;
  createElement(tagName: "thead"): SyntheticHTMLElement;
  createElement(tagName: "time"): SyntheticHTMLElement;
  createElement(tagName: "title"): SyntheticHTMLElement;
  createElement(tagName: "tr"): SyntheticHTMLElement;
  createElement(tagName: "track"): SyntheticHTMLElement;
  createElement(tagName: "tt"): SyntheticHTMLElement;
  createElement(tagName: "u"): SyntheticHTMLElement;
  createElement(tagName: "ul"): SyntheticHTMLElement;
  createElement(tagName: "var"): SyntheticHTMLElement;
  createElement(tagName: "video"): SyntheticHTMLElement;
  createElement(tagName: "wbr"): SyntheticHTMLElement;
  createElement(tagName: "a"): SyntheticHTMLElement;
  createElement(tagName: "abbr"): SyntheticHTMLElement;
  createElement(tagName: "acronym"): SyntheticHTMLElement;
  createElement(tagName: "address"): SyntheticHTMLElement;
  createElement(tagName: "applet"): SyntheticHTMLElement;
  createElement(tagName: "area"): SyntheticHTMLElement;
  createElement(tagName: "article"): SyntheticHTMLElement;
  createElement(tagName: "aside"): SyntheticHTMLElement;
  createElement(tagName: "audio"): SyntheticHTMLElement;
  createElement(tagName: "b"): SyntheticHTMLElement;
  createElement(tagName: "base"): SyntheticHTMLElement;
  createElement(tagName: "basefont"): SyntheticHTMLElement;
  createElement(tagName: "bdi"): SyntheticHTMLElement;
  createElement(tagName: "bdo"): SyntheticHTMLElement;
  createElement(tagName: "big"): SyntheticHTMLElement;
  createElement(tagName: "blockquote"): SyntheticHTMLElement;
  createElement(tagName: "body"): SyntheticHTMLElement;
  createElement(tagName: "br"): SyntheticHTMLElement;
  createElement(tagName: "button"): SyntheticHTMLElement;
  createElement(tagName: "canvas"): SyntheticHTMLElement;
  createElement(tagName: "caption"): SyntheticHTMLElement;
  createElement(tagName: "center"): SyntheticHTMLElement;
  createElement(tagName: "cite"): SyntheticHTMLElement;
  createElement(tagName: "code"): SyntheticHTMLElement;
  createElement(tagName: "col"): SyntheticHTMLElement;
  createElement(tagName: "colgroup"): SyntheticHTMLElement;
  createElement(tagName: "datalist"): SyntheticHTMLElement;
  createElement(tagName: "dd"): SyntheticHTMLElement;
  createElement(tagName: "del"): SyntheticHTMLElement;
  createElement(tagName: "details"): SyntheticHTMLElement;
  createElement(tagName: "dfn"): SyntheticHTMLElement;
  createElement(tagName: "dialog"): SyntheticHTMLElement;
  createElement(tagName: "dir"): SyntheticHTMLElement;
  createElement(tagName: "div"): SyntheticHTMLElement;
  createElement(tagName: "dl"): SyntheticHTMLElement;
  createElement(tagName: "dt"): SyntheticHTMLElement;
  createElement(tagName: "em"): SyntheticHTMLElement;
  createElement(tagName: "embed"): SyntheticHTMLElement;
  createElement(tagName: "fieldset"): SyntheticHTMLElement;
  createElement(tagName: "figcaption"): SyntheticHTMLElement;
  createElement(tagName: "figure"): SyntheticHTMLElement;
  createElement(tagName: "font"): SyntheticHTMLElement;
  createElement(tagName: "footer"): SyntheticHTMLElement;
  createElement(tagName: "form"): SyntheticHTMLElement;
  createElement(tagName: "frame"): SyntheticHTMLElement;
  createElement(tagName: "frameset"): SyntheticHTMLElement;
  createElement(tagName: "head"): SyntheticHTMLElement;
  createElement(tagName: "header"): SyntheticHTMLElement;
  createElement(tagName: "hr"): SyntheticHTMLElement;
  createElement(tagName: "html"): SyntheticHTMLElement;
  createElement(tagName: "i"): SyntheticHTMLElement;
  createElement(tagName: "iframe"): SyntheticHTMLElement;
  createElement(tagName: "img"): SyntheticHTMLElement;
  createElement(tagName: "input"): SyntheticHTMLElement;
  createElement(tagName: "ins"): SyntheticHTMLElement;
  createElement(tagName: "kbd"): SyntheticHTMLElement;
  createElement(tagName: "keygen"): SyntheticHTMLElement;
  createElement(tagName: "label"): SyntheticHTMLElement;
  createElement(tagName: "legend"): SyntheticHTMLElement;
  createElement(tagName: "li"): SyntheticHTMLElement;
  createElement(tagName: "link"): SyntheticHTMLElement;
  createElement(tagName: "main"): SyntheticHTMLElement;
  createElement(tagName: "map"): SyntheticHTMLElement;
  createElement(tagName: "mark"): SyntheticHTMLElement;
  createElement(tagName: "menu"): SyntheticHTMLElement;
  createElement(tagName: "menuitem"): SyntheticHTMLElement;
  createElement(tagName: "meta"): SyntheticHTMLElement;
  createElement(tagName: "meter"): SyntheticHTMLElement;
  createElement(tagName: "nav"): SyntheticHTMLElement;
  createElement(tagName: "noframes"): SyntheticHTMLElement;
  createElement(tagName: "noscript"): SyntheticHTMLElement;
  createElement(tagName: "object"): SyntheticHTMLElement;
  createElement(tagName: "ol"): SyntheticHTMLElement;
  createElement(tagName: "optgroup"): SyntheticHTMLElement;
  createElement(tagName: "option"): SyntheticHTMLElement;
  createElement(tagName: "output"): SyntheticHTMLElement;
  createElement(tagName: "p"): SyntheticHTMLElement;
  createElement(tagName: "param"): SyntheticHTMLElement;
  createElement(tagName: "pre"): SyntheticHTMLElement;
  createElement(tagName: "progress"): SyntheticHTMLElement;
  createElement(tagName: "q"): SyntheticHTMLElement;
  createElement(tagName: "rp"): SyntheticHTMLElement;
  createElement(tagName: "rt"): SyntheticHTMLElement;
  createElement(tagName: "ruby"): SyntheticHTMLElement;
  createElement(tagName: "s"): SyntheticHTMLElement;
  createElement(tagName: "samp"): SyntheticHTMLElement;
  createElement(tagName: "script"): SyntheticHTMLElement;
  createElement(tagName: "section"): SyntheticHTMLElement;
  createElement(tagName: "select"): SyntheticHTMLElement;
  createElement(tagName: "small"): SyntheticHTMLElement;
  createElement(tagName: "source"): SyntheticHTMLElement;
  createElement(tagName: "span"): SyntheticHTMLElement;
  createElement(tagName: "strike"): SyntheticHTMLElement;
  createElement(tagName: "strong"): SyntheticHTMLElement;
  createElement(tagName: "style"): SyntheticHTMLElement;
  createElement(tagName: "sub"): SyntheticHTMLElement;
  createElement(tagName: "summary"): SyntheticHTMLElement;
  createElement(tagName: "sup"): SyntheticHTMLElement;
  createElement(tagName: "table"): SyntheticHTMLElement;
  createElement(tagName: "tbody"): SyntheticHTMLElement;
  createElement(tagName: "td"): SyntheticHTMLElement;
  createElement(tagName: "textarea"): SyntheticHTMLElement;
  createElement(tagName: "tfoot"): SyntheticHTMLElement;
  createElement(tagName: "th"): SyntheticHTMLElement;
  createElement(tagName: "thead"): SyntheticHTMLElement;
  createElement(tagName: "time"): SyntheticHTMLElement;
  createElement(tagName: "title"): SyntheticHTMLElement;
  createElement(tagName: "tr"): SyntheticHTMLElement;
  createElement(tagName: "track"): SyntheticHTMLElement;
  createElement(tagName: "tt"): SyntheticHTMLElement;
  createElement(tagName: "u"): SyntheticHTMLElement;
  createElement(tagName: "ul"): SyntheticHTMLElement;
  createElement(tagName: "var"): SyntheticHTMLElement;
  createElement(tagName: "video"): SyntheticHTMLElement;
  createElement(tagName: "wbr"): SyntheticHTMLElement;
  createElement(unknownTagName: any): SyntheticHTMLElement;

  createElement(tagName: string) {
    return this.own(this.createElementNS(this.defaultNamespaceURI, tagName));
  }

  registerElement(tagName: string, elementClass: syntheticElementClassType);
  registerElement(tagName: string, options: IRegisterComponentOptions);

  registerElement(tagName: string, options: any): syntheticElementClassType {
    return this.registerElementNS(this.defaultNamespaceURI, tagName, options);
  }

  applyEditChange(action: EditChange) {
    super.applyEditChange(action);

    const target: any = {
      [SyntheticDocumentEdit.REMOVE_DOCUMENT_STYLE_SHEET_EDIT]: this.styleSheets,
      [SyntheticDocumentEdit.ADD_DOCUMENT_STYLE_SHEET_EDIT]: this.styleSheets,
      [SyntheticDocumentEdit.MOVE_DOCUMENT_STYLE_SHEET_EDIT]: this.styleSheets
    }[action.type];

    if (target) {
      (<ApplicableEditChange>action).applyTo(target);
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

  onChildAdded(child: SyntheticDOMNode) {
    super.onChildAdded(child);
    child.$attach(this);
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

  private onStyleSheetsAction(action: Action) {
    if (action.type === ArrayMetadataChangeEvent.ARRAY_CHANGE) {
      (<ArrayMetadataChangeEvent<SyntheticCSSStyleSheet>>action).diff.accept({
        visitUpdate: () => {},
        visitInsert: ({ value, index }) => {
          value.$ownerNode = this;
        },
        visitRemove: ({ value, index }) => {
          value.$ownerNode = undefined;
        }
      })
    }
  }
}

function createElementClass(options: IRegisterComponentOptions): syntheticElementClassType {
  return class extends SyntheticDOMElement {
    // TODO
  };
}