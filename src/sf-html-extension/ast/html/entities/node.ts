import * as sift from "sift";
import { ITyped } from "sf-core/object";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { BubbleBus } from "sf-core/busses";
import { DocumentFile } from "sf-front-end/models";
import { MetadataKeys } from "sf-front-end/constants";
import { HTMLExpression } from "sf-html-extension/ast";
import { IHTMLNodeEntity } from "./base";
import { PropertyChangeAction } from "sf-core/actions";
import { diffArray, patchArray } from "sf-core/utils/array";
import { IDOMSection, NodeSection, GroupNodeSection } from "sf-html-extension/dom";
import { IEntity, EntityMetadata, IEntityDocument, BaseEntity, IExpression } from "sf-core/ast";
import { IInjectable, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency, Injector } from "sf-core/dependencies";

export abstract class HTMLNodeEntity<T extends HTMLExpression> extends BaseEntity<T> implements IHTMLNodeEntity {

  private _section: IDOMSection;
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
    return this.source.name;
  }

  compare(entity: HTMLNodeEntity<any>) {
    return super.compare(entity) && entity.nodeName === this.nodeName;
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

  onRemovingChild(child: HTMLNodeEntity<T>) {
    super.onRemovingChild(child);
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
  }

  protected abstract createSection();
}
