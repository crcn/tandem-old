import { IEntity, ElementEntity, ValueNodeEntity } from 'sf-core/entities';
import { EntityFactoryFragment } from 'sf-core/fragments';
import { HTMLElementExpression, HTMLTextExpression, HTMLCommentExpression, HTMLAttributeExpression } from '../../parsers/html/expressions';
import { HTMLNodePreview } from './previews';
import { IElement, INode, IContainerNode, Element, ValueNode, IDiffableValueNode, GroupNodeSection, NodeSection } from 'sf-core/markup';
import TAG_NAMES from './tag-names';

export interface IHTMLEntity extends IEntity { }

function didMount(entity:IHTMLEntity, node:INode) {
  let p = entity.parentNode;
  let pp = <INode>entity;
  while(p && !(p instanceof HTMLElementEntity)) {
    pp = <INode>p;
    p = p.parentNode;
  }
  if (!p) return;

  const tg = (<HTMLElementEntity>p).section.targetNode;

  if (pp.nextSibling) {

    // TODO - this assumes that the next sibling has a section property - it
    // might not. Need to traverse the next sibling for a node that actually has a section
    const ppSection = (<HTMLElementEntity>pp.nextSibling).section;

    if (ppSection instanceof NodeSection) {
      tg.insertBefore(node, (<NodeSection>ppSection).targetNode);
    } else {
      tg.insertBefore(node, (<GroupNodeSection>ppSection).startNode);
    }
  } else {
    (<HTMLElementEntity>p).section.appendChild(node);
  }
}

export class HTMLElementEntity extends ElementEntity implements IHTMLEntity {
  public section: GroupNodeSection|NodeSection;
  constructor(source:HTMLElementExpression) {
    super(source);
    this.section = this.createSection();
  }

  removeAttribute(name:string) {
    super.removeAttribute(name);
    if (this.section instanceof NodeSection) {
      (<IElement>this.section.targetNode).removeAttribute(name);
    }
    for (let i = this.source.attributes.length; i--;) {
      const attribute = this.source.attributes[i];
      if (attribute.name === name) {
        this.source.attributes.splice(i, 1);
        return;
      }
    }
  }
  setAttribute(name:string, value:string) {
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
  didMount() {
    didMount(this, this.section.toFragment());
  }
  willUnmount() {
    this.section.remove();
  }
  protected createSection():GroupNodeSection|NodeSection {
    var element = document.createElement(this.nodeName) as any;
    for (const attribute of this.attributes) {
      element.setAttribute(attribute.name, attribute.value);
    }
    return new NodeSection(element);
  }
}

export class VisibleHTMLElementEntity extends HTMLElementEntity {

  // TODO - change to something such as DisplayComputer
  readonly preview = new HTMLNodePreview(this)
}

export class HTMLDocumentFragmentEntity extends HTMLElementEntity {
  createSection() {
    return new GroupNodeSection();
  }
}

export abstract class HTMLValueNodeEntity extends ValueNodeEntity implements IHTMLEntity {

  public section:NodeSection;
  private _node:Node;

  constructor(readonly source:IDiffableValueNode) {
    super(source);
    this.section = new NodeSection(this._node = this.createDOMNode(source.nodeValue) as any);
  }

  get nodeValue():any {
    return this.source.nodeValue;
  }

  set nodeValue(value:any) {
    if (this.source) this.source.nodeValue = value;
    if (this._node) this._node.nodeValue = value;
  }

  didMount() {
    didMount(this, this._node as any);
  }

  willUnmount() {
    if (this._node.parentElement) {
      this._node.parentNode.removeChild(this._node);
    }
  }

  abstract createDOMNode(nodeValue:any):Node;
}

export class HTMLTextEntity extends HTMLValueNodeEntity {
  createDOMNode(nodeValue:any) {
    return document.createTextNode(nodeValue);
  }
}

export class HTMLCommentEntity extends HTMLValueNodeEntity {
  createDOMNode(nodeValue:any) {
    return document.createComment(nodeValue);
  }
}

export const htmlElementFragments = TAG_NAMES.map((nodeName) => new EntityFactoryFragment(nodeName, VisibleHTMLElementEntity));
export const htmlTextFragment     = new EntityFactoryFragment('#text', HTMLTextEntity);
export const htmlCommentFragment  = new EntityFactoryFragment('#comment', HTMLCommentEntity);
export const htmlDocumentFragment = new EntityFactoryFragment('#document-fragment', HTMLDocumentFragmentEntity);

