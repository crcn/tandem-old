import "./template.scss";

import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { VisibleHTMLElementEntity } from "./base";
import { HTMLElementExpression } from "../../parsers/html/expressions";
import bubbleIframeEvents from "sf-front-end/utils/html/bubble-iframe-events";
import { inject } from "sf-core/decorators";
import { EntityFactoryDependency, IInjectable, APPLICATION_SINGLETON_NS } from "sf-core/dependencies";
import { NodeSection, INode } from "sf-core/markup";
import { FrontEndApplication } from "sf-front-end/application";

export class HTMLTemplateEntity extends VisibleHTMLElementEntity implements IInjectable, IActor {
  private _placeholder: Node;
  private _iframe: HTMLIFrameElement;
  private _body: HTMLElement;

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: FrontEndApplication;

  didMount() {
    super.didMount();
    this.app.actors.push(this);
  }

  execute(action: Action) {
    this._updateZoom();
  }

  willUnmount() {
    super.willUnmount();
    this.app.actors.splice(this.app.actors.indexOf(this), 1);
  }

  didInject() {
    this._updateZoom();
  }

  /**
   * Impl here is a bit odd, but iframes do not pass style.zoom to the iframe
   * body, so we need to manually pass the zoom property of the editor to the iframe
   * whenever it changes.
   */

  _updateZoom() {
    if (!this._body) return;
    this._body.style.zoom = String(this.app.editor.zoom);
  }

  createSection() {
    this._placeholder = document.createElement("div");

    const iframe = this._iframe = document.createElement("iframe");
    iframe.setAttribute("class", "m-template-entity");

    this._iframe.onload = () => {
      const body = this._body = iframe.contentWindow.document.body;
      body.style.margin = body.style.padding = "0px";
      body.appendChild(this._placeholder);

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

export const htmlTemplateEntityDependency = new EntityFactoryDependency("template", HTMLTemplateEntity);