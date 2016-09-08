import "./template.scss";

import { WrapBus } from "mesh";
import { MetadataKeys } from "tandem-front-end/constants";
import bubbleIframeEvents from "tandem-front-end/utils/html/bubble-iframe-events";
import { FrontEndApplication } from "tandem-front-end/application";
import { IEntity, getContext } from "tandem-common/ast";
import { CSSStylesheetsDependency } from "tandem-html-extension/dependencies";
import { NodeSection, GroupNodeSection } from "tandem-html-extension/dom";
import { Action, IActor, inject, TreeNodeAction } from "tandem-common";
import { VisibleHTMLElementEntity, HTMLElementEntity } from "tandem-html-extension";
import { HTMLElementExpression, HTMLFragmentExpression } from "tandem-html-extension/ast";
import { EntityFactoryDependency, IInjectable, Dependency, Dependencies } from "tandem-common/dependencies";

const TEMPLATES_NS = "templates";
class TemplateDependency extends Dependency<PCTemplateEntity> {
  constructor(id: string, artboard: PCTemplateEntity) {
    super([TEMPLATES_NS, id].join("/"), artboard);
  }
  static find(id: string, dependencies: Dependencies) {
    return dependencies.query<TemplateDependency>([TEMPLATES_NS, id].join("/"));
  }
}

class RegisteredPCTemplateEntity extends HTMLElementEntity {

  private __children: IEntity;
  private _templateObserver: IActor;

  initialize() {
    super.initialize();

  }

  createSection() {
    return new GroupNodeSection();
  }

  get template(): PCTemplateEntity {
    return null;
  }

  mapSourceChildren() {
    return [
      ...this.source.attributes,
      ...TemplateDependency.find(this.source.name.toLowerCase(), this.dependencies).value.source.childNodes
    ];
  }

  async load() {
    await super.load();
    this.__children = EntityFactoryDependency.findBySourceType(HTMLFragmentExpression, this.dependencies).create(this.source);
    await this.__children.evaluate(this.context);
  }
};

export class PCTemplateEntity extends VisibleHTMLElementEntity implements IInjectable {

  private _placeholder: Node;
  private _body: HTMLElement;
  private _style: HTMLStyleElement;
  private _iframe: HTMLIFrameElement;

  mapContext(context) {

    if (this.getAttribute("id")) {
      context = Object.assign({}, context);
      const deps = context.dependencies.clone();
      deps.register(
        new TemplateDependency(this.getAttribute("id"), this),
        new EntityFactoryDependency(HTMLElementExpression, RegisteredPCTemplateEntity, this.getAttribute("id"))
      );
      context.dependencies = deps;
    }

    return context;
  }

  onEvaluated() {
    super.onEvaluated();
    this._updateStyle();
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CANVAS_ROOT]: true
    });
  }

  _updateStyle() {
    // update the iframe style with all the stylesheets loaded
    // in the document
    this._style.innerHTML = `
    *:focus {
      outline: none;
    }
    ${ CSSStylesheetsDependency.getInstance(this.dependencies).toString() }
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

export const pcTemplateDependency = new EntityFactoryDependency(HTMLElementExpression, PCTemplateEntity, "template");