import "./artboard.scss";

import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import bubbleIframeEvents from "sf-front-end/utils/html/bubble-iframe-events";
import { NodeSection, INode } from "sf-core/markup";
import { FrontEndApplication } from "sf-front-end/application";
import { HTMLElementExpression } from "sf-html-extension/parsers/html";
import { VisibleHTMLElementEntity } from "./visible-element";
import { EntityFactoryDependency, IInjectable, APPLICATION_SINGLETON_NS } from "sf-core/dependencies";

export class HTMLArtboardEntity extends VisibleHTMLElementEntity implements IInjectable {
  private _placeholder: Node;
  private _iframe: HTMLIFrameElement;
  private _body: HTMLElement;

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: FrontEndApplication;

  didInject() {}

  createSection() {
    this._placeholder = document.createElement("div");

    const iframe = this._iframe = document.createElement("iframe");
    iframe.setAttribute("class", "m-template-entity");

    this._iframe.onload = () => {
      const doc = iframe.contentWindow.document;
      const body = doc.body;
      // doc.removeChild(doc.childNodes[0]); // remove HTML tag

      body.style.margin = body.style.padding = "0px";
      body.appendChild(this._placeholder);
      // this._placeholder = doc.childNodes[0]

      // bubble all iframe events such as mouse clicks and scrolls
      // so that the editor can handle them
      bubbleIframeEvents(iframe);

      // this is particularly important to ensure that the preview stage & tools
      // properly re-draw according
      // TODO - this needs to be something such as new IFrameLoadedAction()
      this.notify(new Action("iframeLoaded"));
    };

    return new NodeSection(iframe as any);
  }

  insertDOMChildBefore(newChild: INode, beforeChild: INode) {
    this._placeholder.insertBefore(newChild as any, beforeChild as any);
  }

  appendDOMChild(newChild: INode) {
    this._placeholder.appendChild(newChild as any);
  }
}

export const htmlArtboardDependency = new EntityFactoryDependency("artboard", HTMLArtboardEntity);