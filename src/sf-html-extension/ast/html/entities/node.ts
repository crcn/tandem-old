import { ITyped } from "sf-core/object";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { BubbleBus } from "sf-core/busses";
import { IHTMLEntity } from "./base";
import { DocumentFile } from "sf-front-end/models";
import { PropertyChangeAction } from "sf-core/actions";
import { diffArray, patchArray } from "sf-core/utils/array";
import { IHTMLContainerExpression, HTMLExpression } from "sf-html-extension/ast";
import { IDOMSection, NodeSection, GroupNodeSection } from "sf-html-extension/dom";
import { IEntity, EntityMetadata, IEntityDocument, BaseEntity, IExpression } from "sf-core/ast";
import { IInjectable, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency, Injector } from "sf-core/dependencies";

export abstract class HTMLNodeEntity<T extends IExpression> extends BaseEntity<T> implements IHTMLEntity {

  readonly section: IDOMSection;
  public document: HTMLFile;

  constructor(source: T) {
    super(source);
    this.section = this.createSection();
  }

  // DOM api compatibility

  get parentNode(): BaseEntity<T> {
    return this.parent;
  }

  get childNodes(): Array<BaseEntity<T>> {
    return this.children;
  }

  get nodeName(): string {
    return this.source.type;
  }

  insertDOMChildBefore(newChild: Node, beforeChild: Node) {
    this.section.targetNode.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: Node) {
    this.section.appendChild(newChild);
  }

  unlinkChild(child: HTMLNodeEntity<T>) {
    super.unlinkChild(child);
    child.section.remove();
  }

  linkChild(child: HTMLNodeEntity<T>) {
    child.document = this.document;
    super.linkChild(child);
    if (child.section) {
      let nextHTMLEntitySibling: HTMLNodeEntity<T>;
      do {
        nextHTMLEntitySibling = <HTMLNodeEntity<T>>child.nextSibling;
      } while (nextHTMLEntitySibling && !nextHTMLEntitySibling.section);

      if (nextHTMLEntitySibling) {
        // TODO - this assumes that the next sibling has a section property - it
        // might not. Need to traverse the next sibling for a node that actually has a section
        const ppSection = (<HTMLNodeEntity<T>>child.nextSibling).section;

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

  protected mapSourceChildren() {
    return this.source.children;
  }
}
