import "./artboard.scss";

import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { MetadataKeys } from "sf-front-end/constants";
import bubbleIframeEvents from "sf-front-end/utils/html/bubble-iframe-events";
import { HTMLElementEntity } from "./element";
import { FrontEndApplication } from "sf-front-end/application";
import { VisibleHTMLElementEntity } from "./visible-element";
import { NodeSection, GroupNodeSection } from "sf-html-extension/dom";
import { IContextualEntity, IEntity, getContext } from "sf-core/ast";
import { HTMLElementExpression, HTMLFragmentExpression } from "sf-html-extension/ast";
import { EntityFactoryDependency, IInjectable, Dependency, Dependencies } from "sf-core/dependencies";

const ARTBOARD_NS = "artboards";
class ArtboardDependency extends Dependency<HTMLArtboardEntity> {
  constructor(id: string, artboard: HTMLArtboardEntity) {
    super([ARTBOARD_NS, id].join("/"), artboard);
  }
  static find(id: string, dependencies: Dependencies) {
    return dependencies.query<ArtboardDependency>([ARTBOARD_NS, id].join("/"));
  }
}

class RegisteredArtboardEntity extends HTMLElementEntity implements IContextualEntity {

  private _context: any;
  private __children: IEntity;

  createSection() {
    return new GroupNodeSection();
  }

  mapSourceChildren() {
    return [
      ...this.source.attributes,
      ...ArtboardDependency.find(this.source.name.toLowerCase(), this._dependencies).value.source.childNodes
    ];
  }

  async loadLeaf() {
    await super.loadLeaf();
    this.__children = EntityFactoryDependency.findBySourceType(HTMLFragmentExpression, this._dependencies).create(new HTMLFragmentExpression(this.source.clone().childNodes, null));

    Object.defineProperty(<IContextualEntity><any>this.__children, "context", {
      get: () => this.context
    });

    await this.__children.load();
  }

  get context() {
    const context = {
      children: this.__children
    };

    for (const attribute of this.attributes) {
      context[attribute.name] = attribute.value;
    }

    return context;
  }
};

export class HTMLArtboardEntity extends VisibleHTMLElementEntity implements IInjectable {

  private _body: HTMLElement;
  private _style: HTMLStyleElement;
  private _iframe: HTMLIFrameElement;
  private _placeholder: Node;

  update() {
    super.update();
  }

  async load() {

    if (this.source.getAttribute("id")) {
      this._dependencies.register(new ArtboardDependency(this.source.getAttribute("id"), this));
      this._dependencies.register(new EntityFactoryDependency(HTMLElementExpression, RegisteredArtboardEntity, this.source.getAttribute("id")));
    }

    return super.load();
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CANVAS_ROOT]: true
    });
  }

  patch(source) {
    super.patch(source);
    this._updateStyle();
  }

  _updateStyle() {
    // update the iframe style with all the stylesheets loaded
    // in the document
    this._style.innerHTML = `
    *:focus {
      outline: none;
    }
    ${ this.document.entity.stylesheets.join("") }
    `;
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
      bubbleIframeEvents(iframe, {
        ignoreInputEvents: true
      });

      // this is particularly important to ensure that the preview stage & tools
      // properly re-draw according
      // TODO - this needs to be something such as new IFrameLoadedAction()
      this.notify(new Action("iframeLoaded"));
    };

    return new NodeSection(this._iframe);
  }

  insertDOMChildBefore(newChild: Node, beforeChild: Node) {
    this._placeholder.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: Node) {
    this._placeholder.appendChild(newChild);
  }
}

export const htmlArtboardDependency = new EntityFactoryDependency(HTMLElementExpression, HTMLArtboardEntity, "artboard");