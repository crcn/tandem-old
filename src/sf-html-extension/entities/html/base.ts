import { HTMLNodeDisplay } from "./displays";
import { IEntity, IVisibleEntity, IElementEntity, findEntityBySource } from "sf-core/entities";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { ChangeAction } from "sf-core/actions";

import {
  HTMLExpression,
  HTMLTextExpression,
  HTMLCommentExpression,
  HTMLElementExpression,
  HTMLAttributeExpression,
  IHTMLValueNodeExpression,
} from "../../parsers/html/expressions";

import {
  INode,
  Element,
  IElement,
  ValueNode,
  NodeSection,
  IContainerNode,
  GroupNodeSection,
  IDiffableValueNode,
} from "sf-core/markup";

import TAG_NAMES from "./tag-names";

function disposeEntity(entity: IHTMLEntity) {
  if (entity.parentNode) {
    const childNodes = (<HTMLElementEntity><any>entity.parentNode).source.childNodes;
    childNodes.splice(childNodes.indexOf(<any>entity.source), 1);
    entity.parentNode.removeChild(entity);
  }
}

export interface IHTMLEntity extends IEntity {
  section: NodeSection|GroupNodeSection;
}

export class HTMLElementEntity extends Element implements IHTMLEntity, IElementEntity {

  // no type specified since certain elements such as <style />, and <link />
  // do not fit into a particular category. This may change later on.
  readonly type: string = null;

  public section: GroupNodeSection|NodeSection;
  constructor(readonly source: HTMLElementExpression) {
    super(source.nodeName);

    this.section = this.createSection();

    // TODO - attributes might need to be transformed here
    if (source.attributes) {
      for (const attribute of source.attributes) {
        this.setAttribute(attribute.name, attribute.value);
      }
    }
  }

  setSourceAttribute(key: string, value: string) {
    this.source.setAttribute(key, value);
    // TODO - this/context.engine.update();
  }

  appendSourceChildNode(...childNodes:Array<HTMLExpression>): IEntity {
    this.source.appendChildNodes(...childNodes);

    // something like this...
    // this.notify(new ChangeAction())
    return null;
  }

  static mapSourceChildren(source: HTMLElementExpression) {
    return source.childNodes;
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
    this.section.appendChild(newChild);
  }

  setAttribute(name: string, value: string) {

    if (this.section instanceof NodeSection) {
      (<IElement>this.section.targetNode).setAttribute(name, value);
    }

    let found = false;
    for (const attribute of this.source.attributes) {
      if (attribute.name === name) {
        attribute.value = value;
        found = true;
      }
    }

    // if the attribute does not exist on the expression, then create a new one.
    if (!found) {
      this.source.attributes.push(new HTMLAttributeExpression(name, value, undefined));
    }

    super.setAttribute(name, value);
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

  dispose() {
    disposeEntity(this);
  }
}

export class VisibleHTMLElementEntity extends HTMLElementEntity implements IVisibleEntity {

  readonly type: string = "display";

  // TODO - change to something such as DisplayComputer
  readonly display = new HTMLNodeDisplay(this);
}

export class HTMLDocumentFragmentEntity extends HTMLElementEntity {
  createSection() {
    return new GroupNodeSection();
  }
}

export abstract class HTMLValueNodeEntity<T extends IHTMLValueNodeExpression> extends ValueNode implements IHTMLEntity {

  readonly type: string = null;

  readonly section: NodeSection;
  private _node: Node;

  constructor(readonly source: T) {
    super(source.nodeName, source.nodeValue);
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

  dispose() {
    disposeEntity(this);
  }
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
export const htmlDocumentDependency = new EntityFactoryDependency("#document-fragment", HTMLDocumentFragmentEntity);

