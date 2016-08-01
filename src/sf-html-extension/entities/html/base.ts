import { HTMLNodeDisplay } from "./displays";
import { IEntity, IVisibleEntity } from "sf-core/entities";
import { EntityFactoryDependency } from "sf-core/dependencies";

import {
  HTMLElementExpression,
  HTMLTextExpression,
  IHTMLValueNodeExpression,
  HTMLCommentExpression,
  HTMLAttributeExpression
} from "../../parsers/html/expressions";

import {
  IElement,
  INode,
  IContainerNode,
  Element,
  ValueNode,
  IDiffableValueNode,
  GroupNodeSection,
  NodeSection
} from "sf-core/markup";

import TAG_NAMES from "./tag-names";

export interface IHTMLEntity extends IEntity {
  section: NodeSection|GroupNodeSection;
}

export class HTMLElementEntity extends Element implements IHTMLEntity {

  // no type specified since certain elements such as <style />, and <link />
  // do not fit into a particular category. This may change later on.
  readonly type: string = null;

  public section: GroupNodeSection|NodeSection;
  constructor(readonly expression: HTMLElementExpression) {
    super(expression.nodeName);

    this.section = this.createSection();

    // TODO - attributes might need to be transformed here
    if (expression.attributes) {
      for (const attribute of expression.attributes) {
        this.setAttribute(attribute.name, attribute.value);
      }
    }
  }

  render() {
    return this.expression.childNodes;
  }

  removeAttribute(name: string) {
    super.removeAttribute(name);
    if (this.section instanceof NodeSection) {
      (<IElement>this.section.targetNode).removeAttribute(name);
    }
    for (let i = this.expression.attributes.length; i--; ) {
      const attribute = this.expression.attributes[i];
      if (attribute.name === name) {
        this.expression.attributes.splice(i, 1);
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
    if (!this.expression) return;
    if (this.section instanceof NodeSection) {
      (<IElement>this.section.targetNode).setAttribute(name, value);
    }
    for (const attribute of this.expression.attributes) {
      if (attribute.name === name) {
        attribute.value = value;
        return;
      }
    }

    // this is janky as hell - attributes should be immutable here
    this.expression.attributes.push(new HTMLAttributeExpression(name, value, undefined));
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
          this.insertDOMChildBefore(child.section.toDependency(), (<NodeSection>ppSection).targetNode);
        } else {
          this.insertDOMChildBefore(child.section.toDependency(), (<GroupNodeSection>ppSection).startNode);
        }
      } else {
        this.appendDOMChild(child.section.toDependency());
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

  readonly type: string = "display";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);
}

export class HTMLDocumentDependencyEntity extends HTMLElementEntity {
  createSection() {
    return new GroupNodeSection();
  }
}

export abstract class HTMLValueNodeEntity<T extends IHTMLValueNodeExpression> extends ValueNode implements IHTMLEntity {

  readonly type: string = null;

  readonly section: NodeSection;
  private _node: Node;

  constructor(readonly expression: T) {
    super(expression.nodeName, expression.nodeValue);
    this.section = new NodeSection(this._node = this.createDOMNode(expression.nodeValue) as any);
  }

  render() {
    return null;
  }

  get nodeValue(): any {
    return this.expression.nodeValue;
  }

  set nodeValue(value: any) {
    if (this.expression) this.expression.nodeValue = value;
    if (this._node) this._node.nodeValue = value;
  }

  willUnmount() {
    if (this._node.parentElement) {
      this._node.parentNode.removeChild(this._node);
    }
  }

  abstract createDOMNode(nodeValue: any): Node;
}

export class HTMLTextEntity extends HTMLValueNodeEntity<HTMLTextExpression> {
  createDOMNode(nodeValue: any) {
    return document.createTextNode(nodeValue);
  }
}

export class HTMLCommentEntity extends HTMLValueNodeEntity<HTMLCommentExpression> {
  createDOMNode(nodeValue: any) {
    return document.createComment(nodeValue);
  }
}

export const htmlElementDependencies = TAG_NAMES.map((nodeName) => new EntityFactoryDependency(nodeName, VisibleHTMLElementEntity));
export const htmlTextDependency     = new EntityFactoryDependency("#text", HTMLTextEntity);
export const htmlCommentDependency  = new EntityFactoryDependency("#comment", HTMLCommentEntity);
export const htmlDocumentDependency = new EntityFactoryDependency("#document-fragment", HTMLDocumentDependencyEntity);
