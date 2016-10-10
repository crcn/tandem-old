import * as sift from "sift";
import { WrapBus } from "mesh";
import { MetadataKeys } from "@tandem/editor/constants";
import { MarkupContainerEntity } from "./node";
import { IHTMLNodeEntity } from "./base";
import { parseCSS, parseCSSStyle } from "@tandem/html-extension/lang";
import { IDOMSection, NodeSection } from "@tandem/html-extension/dom";
import { MarkupElementExpression, MarkupAttributeExpression } from "@tandem/html-extension/lang/html/ast";
import { CSSRuleExpression, IMarkupElementAttributeEntity } from "@tandem/html-extension/lang";
import {
  Action,
  INamed,
  IValued,
  IEntity,
  bindable,
  BaseEntity,
  IASTNode,
  TreeNodeAction,
  EntityBodyController,
  PropertyChangeAction,
  AttributeChangeAction,
  EntityFactoryDependency,
} from "@tandem/common";

export class MarkupElementEntity extends MarkupContainerEntity<MarkupElementExpression> implements IHTMLNodeEntity {

  get attributes(): Array<BaseEntity<any> & IMarkupElementAttributeEntity> {
    return <any>this.children.filter((child) => child.source.constructor === MarkupAttributeExpression);
  }

  mapSourceChildren() {
    return [
      ...this.source.attributes,
      ...this.source.childNodes
    ];
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
        const expr = new MarkupAttributeExpression(name, value, null);
        this.source.appendChild(expr);
        const entity = new MarkupAttributeEntity(expr);
        this.appendChild(entity);
      }
    } else {
      attribute.value = value;
    }
  }

  hasAttribute(name: string) {
    return !!this.getAttributeEntity(name);
  }

  getAttributeEntity(name: string): IMarkupElementAttributeEntity {
    return this.attributes.find((attribute) => attribute.source.name === name);
  }

  cloneLeaf() {
    return new (this.constructor as any)(this.source);
  }

  protected onChildAction(action: Action) {
    super.onChildAction(action);

    const element = <Element>this.section.targetNode;

    if (action.target.parent === this && action.target.source instanceof MarkupAttributeExpression) {
      if (action.type === TreeNodeAction.NODE_REMOVED) {

        // diffing algorithim may remove an attribute if it's out of order, but it
        // still may exist -- ignore the node removal if it's still there
        if (!this.source.getAttribute(action.target.name)) {
          if (this.section instanceof NodeSection) {
            element.removeAttribute(action.target.name);
          }
          this.onAttributeChange(action.target.name, undefined);
        }
      } else if (action.type === PropertyChangeAction.PROPERTY_CHANGE || action.type === TreeNodeAction.NODE_ADDED) {
        if (this.section instanceof NodeSection) {
          element.setAttribute(action.target.name, action.target.value);
        }
        this.onAttributeChange(action.target.name, action.target.value);
      }
    }
  }
  protected onAttributeChange(name: string, value: any) {

  }
}

export class MarkupAttributeEntity extends BaseEntity<MarkupAttributeExpression> {

  public name: string;

  @bindable()
  public value: any;

  constructor(source: MarkupAttributeExpression) {
    super(source);
    this.name = source.name;
  }

  async evaluate(context) {
    await super.evaluate(context);
    if (typeof this.source.value === "object") {
      this.value = (<IValued><any>this.firstChild).value;
    } else {
      this.value = this.source.value;
    }
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
    const clone = new MarkupAttributeEntity(this.source);
    clone.value = this.value;
    return clone;
  }
}

export const defaultAttributeFactoryDependency = new EntityFactoryDependency(MarkupAttributeExpression, MarkupAttributeEntity);