import "./artboard.scss";

import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { MetadataKeys } from "sf-front-end/constants";
import bubbleIframeEvents from "sf-front-end/utils/html/bubble-iframe-events";
import { FrontEndApplication } from "sf-front-end/application";
import { HTMLElementExpression } from "sf-html-extension/ast";
import { CSSStyleSheetsDependency } from "sf-html-extension/dependencies";
import { VisibleHTMLElementEntity } from "./visible-element";
import { NodeSection, GroupNodeSection } from "sf-html-extension/dom";
import { IContextualEntity, INodeEntity, IContainerNodeEntity } from "sf-core/ast";
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

class RegisteredArtboardEntity extends VisibleHTMLElementEntity implements IContextualEntity {

  private _context: any;
  private _childrenSection: GroupNodeSection;
  private __children: IContainerNodeEntity;

  constructor(source: HTMLElementExpression) {
    super(source);
    this._childrenSection = new GroupNodeSection();
  }

  createSection() {
    return new GroupNodeSection();
  }

  mapSourceChildNodes() {
    return ArtboardDependency.find(this.name.toLowerCase(), this._dependencies).value.source.children;
  }

  get context() {
    return this._context;
  }

  patchSelf(entity: RegisteredArtboardEntity) {
    super.patchSelf(entity);
    this.updateContext();
  }

  async loadSelf() {
    await super.loadSelf();
    this.__children = EntityFactoryDependency.findByName("#document-fragment", this._dependencies).create(this._source);
    await this.__children.load();
    this.updateContext();
  }

  updateContext() {
    this._context = {
      children: this.__children
    };
    for (const attribute of this.attributes) {
      this._context[attribute.name] = attribute.value;
    }
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
      this._dependencies.register(new EntityFactoryDependency(this.source.getAttribute("id"), RegisteredArtboardEntity));
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
    ${ CSSStyleSheetsDependency.findOrRegister(this._dependencies).toString() }
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

export const htmlArtboardDependency = new EntityFactoryDependency("artboard", HTMLArtboardEntity);