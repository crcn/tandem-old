import { IEntity, IVisibleEntity, ElementEntity, ValueNodeEntity } from "sf-core/entities";
import { EntityFactoryFragment } from "sf-core/fragments";
import { HTMLElementExpression, HTMLTextExpression, HTMLCommentExpression, HTMLAttributeExpression } from "../../parsers/html/expressions";
import { HTMLNodeDisplay } from "./displays";
import { IElement, INode, IContainerNode, Element, ValueNode, IDiffableValueNode, GroupNodeSection, NodeSection } from "sf-core/markup";
import TAG_NAMES from "./tag-names";

export interface IHTMLEntity extends IEntity {
  section: NodeSection|GroupNodeSection;
}

export class HTMLElementEntity extends ElementEntity implements IHTMLEntity {
  public section: GroupNodeSection|NodeSection;
  constructor(source: HTMLElementExpression) {
    super(source);
    this.section = this.createSection();

    if (this.section instanceof NodeSection) {
      for (const attribute of this.attributes) {
        (<IElement>this.section.targetNode).setAttribute(attribute.name, attribute.value);
      }
    }
  }

  removeAttribute(name: string) {
    super.removeAttribute(name);
    if (this.section instanceof NodeSection) {
      (<IElement>this.section.targetNode).removeAttribute(name);
    }
    for (let i = this.source.attributes.length; i--; ) {
      const attribute = this.source.attributes[i];
      if (attribute.name === name) {
        this.source.attributes.splice(i, 1);
        return;
      }
    }
  }

  insertDOMChildBefore(newChild: INode, beforeChild: INode) {
    this.section.targetNode.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: INode) {
    this.section.targetNode.appendChild(newChild);
  }

  setAttribute(name: string, value: string) {
    super.setAttribute(name, value);
    if (!this.source) return;
    if (this.section instanceof NodeSection) {
      (<IElement>this.section.targetNode).setAttribute(name, value);
    }
    for (const attribute of this.source.attributes) {
      if (attribute.name === name) {
        attribute.value = value;
        return;
      }
    }

    // this is janky as hell - attributes should be immutable here
    this.source.attributes.push(new HTMLAttributeExpression(name, value, undefined));
  }

  _link(child) {
    super._link(child);
    if (child.section) {
      let nextHTMLEntitySibling: IHTMLEntity;
      do {
        nextHTMLEntitySibling = <IHTMLEntity>child.nextSibling;
      } while (nextHTMLEntitySibling && !nextHTMLEntitySibling.section);

      if (nextHTMLEntitySibling) {
        // TODO - this assumes that the next sibling has a section property - it
        // might not. Need to traverse the next sibling for a node that actually has a section
        const ppSection = (<HTMLElementEntity>child.nextSibling).section;

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

  willUnmount() {
    this.section.remove();
  }
  protected createSection(): GroupNodeSection|NodeSection {
    const element = document.createElement(this.nodeName) as any;
    return new NodeSection(element);
  }
}

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleEntity {

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);
}

export class HTMLDocumentFragmentEntity extends HTMLElementEntity {
  createSection() {
    return new GroupNodeSection();
  }
}

export abstract class HTMLValueNodeEntity extends ValueNodeEntity implements IHTMLEntity {

  public section: NodeSection;
  private _node: Node;

  constructor(readonly source: IDiffableValueNode) {
    super(source);
    this.section = new NodeSection(this._node = this.createDOMNode(source.nodeValue) as any);
  }

  get nodeValue(): any {
    return this.source.nodeValue;
  }

  set nodeValue(value: any) {
    if (this.source) this.source.nodeValue = value;
    if (this._node) this._node.nodeValue = value;
  }

  willUnmount() {
    if (this._node.parentElement) {
      this._node.parentNode.removeChild(this._node);
    }
  }

  abstract createDOMNode(nodeValue: any): Node;
}

export class HTMLTextEntity extends HTMLValueNodeEntity {
  createDOMNode(nodeValue: any) {
    return document.createTextNode(nodeValue);
  }
}

export class HTMLCommentEntity extends HTMLValueNodeEntity {
  createDOMNode(nodeValue: any) {
    return document.createComment(nodeValue);
  }
}

export const htmlElementFragments = TAG_NAMES.map((nodeName) => new EntityFactoryFragment(nodeName, VisibleHTMLElementEntity));
export const htmlTextFragment     = new EntityFactoryFragment("#text", HTMLTextEntity);
export const htmlCommentFragment  = new EntityFactoryFragment("#comment", HTMLCommentEntity);
export const htmlDocumentFragment = new EntityFactoryFragment("#document-fragment", HTMLDocumentFragmentEntity);
