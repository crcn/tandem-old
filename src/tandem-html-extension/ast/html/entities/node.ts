import * as sift from "sift";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { DocumentFile } from "tandem-front-end/models";
import { MetadataKeys } from "tandem-front-end/constants";
import { IHTMLNodeEntity } from "./base";
import { IDOMSection, NodeSection, GroupNodeSection } from "tandem-html-extension/dom";
import { HTMLNodeExpression, HTMLContainerExpression } from "tandem-html-extension/ast";
import {
  inject,
  ITyped,
  IEntity,
  Injector,
  BubbleBus,
  BaseEntity,
  IInjectable,
  IExpression,
  Dependencies,
  EntityMetadata,
  IEntityDocument,
  DEPENDENCIES_NS,
  PropertyChangeAction,
  EntityBodyController,
  EntityFactoryDependency,
} from "tandem-common";

export abstract class HTMLNodeEntity<T extends HTMLNodeExpression> extends BaseEntity<T> implements IHTMLNodeEntity {

  private _section: IDOMSection;
  private _nodeName: string;
  public document: HTMLFile;

  get section(): IDOMSection {
    return this._section;
  }

  get parentNode(): BaseEntity<T> {
    return this.parent;
  }

  get childNodes(): Array<HTMLNodeEntity<T>> {
    return <any>this.children.filter(<any>sift({ $type: HTMLNodeEntity }));
  }

  get nodeName(): string {
    return this._nodeName;
  }

  shouldDispose() {
    return super.shouldDispose() || this.nodeName !== this.source.name;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.CHILD_LAYER_PROPERTY]: "childNodes"
    });
  }

  insertDOMChildBefore(newChild: Node, beforeChild: Node) {
    this.section.targetNode.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: Node) {
    this.section.appendChild(newChild);
  }

  onChildRemoved(child: HTMLNodeEntity<T>) {
    super.onChildRemoved(child);
    if (child.section) child.section.remove();
  }

  onChildAdded(child: HTMLNodeEntity<T>) {
    super.onChildAdded(child);
    if (child.section) {
      const childNodes = this.childNodes;
      const nextHTMLEntitySibling: HTMLNodeEntity<T> = childNodes[childNodes.indexOf(child) + 1];

      if (nextHTMLEntitySibling) {
        const ppSection = nextHTMLEntitySibling.section;

        if (nextHTMLEntitySibling.section instanceof NodeSection) {
          this.insertDOMChildBefore(child.section.toFragment(), ppSection.targetNode);
        } else {
          this.insertDOMChildBefore(child.section.toFragment(), (<GroupNodeSection>ppSection).startNode);
        }
      } else {
        this.appendDOMChild(child.section.toFragment());
      }
    }
  }

  protected initialize() {
    super.initialize();
    this._section  = this.createSection();
    this._nodeName = this.source.name;
  }

  protected abstract createSection();
}


export abstract class HTMLContainerEntity<T extends HTMLContainerExpression> extends HTMLNodeEntity<T> {
  protected _childController: EntityBodyController;
  protected initialize() {
    super.initialize();
    this._childController = new EntityBodyController(this, this.mapSourceChildren.bind(this));
  }

  protected async load() {
    await this._childController.evaluate(this.getChildContext());
  }

  protected async update() {
    await this._childController.evaluate(this.getChildContext());
  }

  protected mapSourceChildren() {
    return this.source.children;
  }

  protected getChildContext() {
    return this.context;
  }
}