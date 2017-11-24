import { getSEnvParentNodeClass, SEnvParentNodeMutationTypes, SEnvParentNodeInterface } from "./parent-node";
import { getSEnvEventClasses, SEnvMutationEventInterface } from "../events";
import { SEnvHTMLElementInterface } from "./html-elements";
import { SEnvNodeTypes, SVG_XMLNS, HTML_XMLNS } from "../constants";
import { SEnvNodeInterface } from "./node";
import { SyntheticLightDocument } from "../../state";
import { SEnvWindowInterface } from "../window";
import { getSEnvHTMLCollectionClasses, SEnvNodeListInterface } from "./collections";
import { SEnvDocumentInterface } from "./document";

export interface SEnvLightDocumentInterface extends ShadowRoot, SEnvParentNodeInterface {
  readonly struct: SyntheticLightDocument;
  ownerDocument: SEnvDocumentInterface;
  defaultView: SEnvWindowInterface;
  childNodes: SEnvNodeListInterface;
  addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, useCapture?: boolean): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

export interface SEnvShadowRootInterface extends SEnvLightDocumentInterface, ShadowRoot {
  host: SEnvHTMLElementInterface;
  childNodes: SEnvNodeListInterface;
  ownerDocument: SEnvDocumentInterface;
  addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, useCapture?: boolean): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}


export const getSenvLightDocumentClass = (context) => {
  const SEnvParentNode = getSEnvParentNodeClass(context);
  const { SEnvStyleSheetList, SEnvHTMLAllCollection } = getSEnvHTMLCollectionClasses(context);
  class SEnvLightDocument extends SEnvParentNode {
    
    getSelection(): Selection {
      this._throwUnsupportedMethod();
      return null;
    }

    activeElement: SEnvHTMLElementInterface;
    private _stylesheets: StyleSheetList;

    get stylesheets(): StyleSheetList {
      return this._stylesheets || (this._stylesheets = this._createStyleSheetList());
    }
    
    get innerHTML() {
      return "";
    }

    set innerHTML(value) {
      this._throwUnsupportedMethod();
    }
    
    private _createStyleSheetList() {

      const styleSheets = [];
      
      Array.prototype.forEach.call(this.querySelectorAll("*"), (element) => {
        if (element.nodeType === SEnvNodeTypes.ELEMENT && element["sheet"]) {
          styleSheets.push(element["sheet"]);
        }
      });

      return new SEnvStyleSheetList(...styleSheets);
    }

    get styleSheets(): StyleSheetList {
      return this.stylesheets;
    }
    
    elementFromPoint(x: number, y: number): Element {
      this._throwUnsupportedMethod();
      return null;
    }

    elementsFromPoint(x: number, y: number) {
      this._throwUnsupportedMethod();
      return null;
    }
    
    getElementById(elementId: string): HTMLElement | null {
      return this.querySelector(`#${elementId}`) as HTMLElement;
    }

    protected _onMutation(event: SEnvMutationEventInterface) {
      super._onMutation(event);
      const { mutation } = event;

      if (mutation.$type === SEnvParentNodeMutationTypes.INSERT_CHILD_NODE_EDIT || mutation.$type === SEnvParentNodeMutationTypes.REMOVE_CHILD_NODE_EDIT) {
        this._stylesheets = null;
      }
    }
  }

  return SEnvLightDocument;
}

export const getHostDocument = (node: SEnvNodeInterface) => {
  let p = node;

  // return shadow root since :host selector may be applied
  if (p["shadowRoot"]) {
    return p["shadowRoot"];
  }
  
  while(p && p.nodeType !== SEnvNodeTypes.DOCUMENT && p.nodeType !== SEnvNodeTypes.DOCUMENT_FRAGMENT) {
    p = p.parentNode as SEnvNodeInterface;
  }
  return p;
};

export const getSEnvShadowRootClass = (context) => {
  const SEnvLightDocument = getSenvLightDocumentClass(context);
  class SEnvShadowRoot extends SEnvLightDocument implements ShadowRoot {
    host: SEnvHTMLElementInterface;
    readonly nodeType = SEnvNodeTypes.DOCUMENT_FRAGMENT;
    constructor() {
      super();
      this.nodeName = "#document-fragment";
    }
    cloneShallow() {
      return new SEnvShadowRoot();
    }
    createStruct() {
      return {
        ...super.createStruct(),
        hostId: this.host ? this.host.$id : null
      };
    }
  }

  return SEnvShadowRoot;
}