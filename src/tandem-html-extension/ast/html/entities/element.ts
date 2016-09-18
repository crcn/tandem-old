import * as sift from "sift";
import { WrapBus } from "mesh";
import { MetadataKeys } from "tandem-front-end/constants";
import { HTMLContainerEntity } from "./node";
import { IHTMLNodeEntity } from "./base";
import { parseCSS, parseCSSStyle } from "tandem-html-extension/ast";
import { IDOMSection, NodeSection } from "tandem-html-extension/dom";
import { HTMLElementExpression, HTMLAttributeExpression } from "tandem-html-extension/ast/html/expressions";
import { CSSRuleExpression, IHTMLElementAttributeEntity } from "tandem-html-extension/ast";
import {
  Action,
  INamed,
  IValued,
  IEntity,
  bindable,
  BaseEntity,
  IExpression,
  TreeNodeAction,
  EntityBodyController,
  PropertyChangeAction,
  AttributeChangeAction,
  EntityFactoryDependency,
} from "tandem-common";

export class HTMLElementEntity extends HTMLContainerEntity<HTMLElementExpression> implements IHTMLNodeEntity {

  get attributes(): Array<BaseEntity<any> & IHTMLElementAttributeEntity> {
    return <any>this.children.filter((child) => child.source.constructor === HTMLAttributeExpression);
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.LAYER_DEPENDENCY_NAME]: "element"
    });
  }

  get cssRuleExpressions(): Array<CSSRuleExpression> {
    return [];
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.source.name));
  }

  removeAttribute(name: string) {
    for (const attribute of this.attributes) {
      if (attribute.name === name) {
        this.removeChild(attribute);
      }
    }
  }

  getAttribute(name: string) {
    const attribute = this.getAttributeEntity(name);
    return attribute ? attribute.value : undefined;
  }

  setAttribute(name: string, value: any) {
    const attribute = this.getAttributeEntity(name);
    if (!attribute) {

      // this will happen if the entity has not updated yet -- i.e:
      // it's dirty.
      if (!this.source.getAttribute(name)) {
        const expr = new HTMLAttributeExpression(name, value, null);
        this.source.appendChild(expr);
        const entity = new HTMLAttributeEntity(expr);
        this.appendChild(entity);
      }
    } else {
      attribute.value = value;
    }
  }

  hasAttribute(name: string) {
    return !!this.getAttributeEntity(name);
  }

  getAttributeEntity(name: string): IHTMLElementAttributeEntity {
    return this.attributes.find((attribute) => attribute.source.name === name);
  }

  cloneLeaf() {
    return new (this.constructor as any)(this.source);
  }

  protected onChildAction(action: Action) {
    super.onChildAction(action);

    if (!(this.section instanceof NodeSection)) {
      return;
    }
    const element = <Element>this.section.targetNode;

    if (action.target.parent === this && action.target.source instanceof HTMLAttributeExpression) {
      if (action.type === TreeNodeAction.NODE_REMOVED) {

        // diffing algorithim may remove an attribute if it's out of order, but it
        // still may exist -- ignore the node removal if it's still there
        if (!this.source.getAttribute(action.target.name)) {
          element.removeAttribute(action.target.name);
        }
      } else if (action.type === PropertyChangeAction.PROPERTY_CHANGE || action.type === TreeNodeAction.NODE_ADDED) {
        element.setAttribute(action.target.name, action.target.value);
      }
    }
  }
}

export class HTMLAttributeEntity extends BaseEntity<HTMLAttributeExpression> {

  public name: string;

  @bindable()
  public value: any;

  constructor(source: HTMLAttributeExpression) {
    super(source);
    this.name = source.name;
  }

  async evaluate(context: any) {
    await super.evaluate(context);
    if (this.hasLoadableValue) {
      this.value = (<IValued><any>this.firstChild).value;
    } else {
      this.value = this.source.value;
    }
  }
  get hasLoadableValue() {
    return typeof this.source.value === "object";
  }

  shouldDispose() {
    return super.shouldDispose() || this.name !== this.source.name;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.SELECTABLE]: false
    });
  }

  cloneLeaf() {
    return new HTMLAttributeEntity(this.source);
  }
}

export const defaultAttributeFactoryDependency = new EntityFactoryDependency(HTMLAttributeExpression, HTMLAttributeEntity);