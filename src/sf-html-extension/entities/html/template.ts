import "./template.scss";

import { Action } from "sf-core/actions";
import { VisibleHTMLElementEntity } from "./base";
import { HTMLElementExpression } from "../../parsers/html/expressions";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { NodeSection, INode } from "sf-core/markup";

export class HTMLTemplateEntity extends VisibleHTMLElementEntity {
  private _placeholder: Node;
  private _iframe: HTMLIFrameElement;

  didMount() {
    super.didMount();
    // register
  }

  willUnmount() {
    super.willUnmount();
    // unregister
  }

  createSection() {
    this._placeholder = document.createElement("div");

    const iframe = this._iframe = document.createElement("iframe");
    iframe.setAttribute("class", "m-template-entity");
    this._iframe.onload = () => {
      const body = iframe.contentWindow.document.body;
      body.style.margin = body.style.padding = "0px";
      body.appendChild(this._placeholder);

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