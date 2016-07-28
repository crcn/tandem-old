import "./template.scss";

import { VisibleHTMLElementEntity } from "./base";
import { HTMLElementExpression } from '../../parsers/html/expressions';
import { EntityFactoryFragment } from "sf-core/fragments"
import { NodeSection, INode } from 'sf-core/markup';

export class HTMLTemplateEntity extends VisibleHTMLElementEntity {
  private _placeholder:Node;
  private _iframe:HTMLIFrameElement;

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
    iframe.setAttribute('class', 'm-template-entity');
    this._iframe.onload = () => {
      const body = iframe.contentWindow.document.body;
      body.style.margin = body.style.padding = "0px";
      body.appendChild(this._placeholder);
      // TODO - this.notify(new Action('iframeLoad')); or similar
    };

    return new NodeSection(iframe as any);
  }

  insertDOMChildBefore(newChild:INode, beforeChild:INode) {
    this._placeholder.insertBefore(newChild as any, beforeChild as any);
  }

  appendDOMChild(newChild:INode) {
    this._placeholder.appendChild(newChild as any);
  }
}

export const htmlTemplateEntityFragment = new EntityFactoryFragment("template", HTMLTemplateEntity);