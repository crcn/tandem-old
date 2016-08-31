import { ITyped } from "sf-core/object";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { BubbleBus } from "sf-core/busses";
import { DocumentFile } from "sf-front-end/models";
import { ContainerNode, INode } from "sf-core/markup";
import { PropertyChangeAction } from "sf-core/actions";
import { diffArray, patchArray } from "sf-core/utils/array";
import { IHTMLEntity, IHTMLContainerEntity } from "./base";
import { IHTMLContainerExpression, HTMLExpression } from "sf-html-extension/ast";
import { IDOMSection, NodeSection, GroupNodeSection } from "sf-html-extension/dom";
import { IInjectable, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency, Injector } from "sf-core/dependencies";
import { IEntity, IContainerNodeEntity, EntityMetadata, IContainerNodeEntitySource, IEntityDocument, BaseContainerNodeEntity } from "sf-core/ast";

export abstract class HTMLContainerEntity<T extends ITyped> extends BaseContainerNodeEntity<T> implements IHTMLContainerEntity {

  readonly children: Array<IHTMLEntity>;
  readonly section: IDOMSection;
  public document: HTMLFile;

  constructor(source: T) {
    super(source);
    this.section = this.createSection();
  }

  insertDOMChildBefore(newChild: Node, beforeChild: Node) {
    this.section.targetNode.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: Node) {
    this.section.appendChild(newChild);
  }

  _unlink(child: IHTMLEntity) {
    super._unlink(child);
    child.section.remove();
  }

  _link(child: IHTMLEntity) {
    child.document = this.document;
    super._link(child);
    if (child.section) {
      let nextHTMLEntitySibling: IHTMLEntity;
      do {
        nextHTMLEntitySibling = <IHTMLEntity>child.nextSibling;
      } while (nextHTMLEntitySibling && !nextHTMLEntitySibling.section);

      if (nextHTMLEntitySibling) {
        // TODO - this assumes that the next sibling has a section property - it
        // might not. Need to traverse the next sibling for a node that actually has a section
        const ppSection = (<IHTMLEntity>child.nextSibling).section;

        if (nextHTMLEntitySibling.section instanceof NodeSection) {
          this.insertDOMChildBefore(child.section.toFragment(), (<NodeSection>ppSection).targetNode);
        } else {
          this.insertDOMChildBefore(child.section.toFragment(), (<GroupNodeSection>ppSection).startNode);
        }
      } else {
        this.appendDOMChild(child.section.toFragment());
      }
    }
  }

  protected abstract createSection();

  protected mapSourceChildNodes() {
    return (<IHTMLContainerExpression><any>this.source).children || [];
  }
}
