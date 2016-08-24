import "./artboard.scss";

import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { MetadataKeys } from "sf-front-end/constants";
import bubbleIframeEvents from "sf-front-end/utils/html/bubble-iframe-events";
import { HTMLDocumentEntity } from "./document";
import { NodeSection, INode } from "sf-core/markup";
import { FrontEndApplication } from "sf-front-end/application";
import { HTMLElementExpression } from "sf-html-extension/parsers/html";
import { VisibleHTMLElementEntity } from "./visible-element";
import { EntityFactoryDependency, IInjectable, APPLICATION_SINGLETON_NS } from "sf-core/dependencies";

export class HTMLArtboardEntity extends VisibleHTMLElementEntity implements IInjectable {

  private _body: HTMLElement;
  private _style: HTMLStyleElement;
  private _iframe: HTMLIFrameElement;
  private _placeholder: Node;

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: FrontEndApplication;

  didInject() {}

  willChangeDocument(document: HTMLDocumentEntity) {
    super.willChangeDocument(document);
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CANVAS_ROOT]: false
    });
  }

  async sync() {
    await super.sync();
    this._updateStyle();
  }

  _updateStyle() {
    // update the iframe style with all the stylesheets loaded
    // in the document
    this._style.innerHTML = this.document.stylesheet.toString();
  }

  createSection() {
    this._style = document.createElement("style");
    this._placeholder = document.createElement("div");

    const iframe = this._iframe = document.createElement("iframe");
    iframe.setAttribute("class", "m-artboard");

    this._iframe.onload = () => {
      const doc = iframe.contentWindow.document;
      const body = doc.body;
      this._updateStyle();

      body.style.margin = body.style.padding = "0px";

      // style inherited from the parent document since
      // the iframe is isolated
      body.appendChild(this._style);
      body.appendChild(this._placeholder);

      // bubble all iframe events such as mouse clicks and scrolls
      // so that the editor can handle them
      bubbleIframeEvents(iframe);

      // this is particularly important to ensure that the preview stage & tools
      // properly re-draw according
      // TODO - this needs to be something such as new IFrameLoadedAction()
      this.notify(new Action("iframeLoaded"));
    };

    return new NodeSection(this._iframe as any);
  }

  insertDOMChildBefore(newChild: INode, beforeChild: INode) {
    this._placeholder.insertBefore(newChild as any, beforeChild as any);
  }

  appendDOMChild(newChild: INode) {
    this._placeholder.appendChild(newChild as any);
  }
}

export const htmlArtboardDependency = new EntityFactoryDependency("artboard", HTMLArtboardEntity);