import { Action } from "sf-core/actions";
import { IValued } from "sf-core/object";
import { WrapBus } from "mesh";
import { bindable } from "sf-core/decorators";
import { BaseEntity } from "sf-core/ast";
import { IHTMLEntity } from "./base";
import { MetadataKeys } from "sf-front-end/constants";
import { HTMLNodeEntity } from "./node";
import { TreeBranch, TreeNode } from "sf-core/tree";
import { diffArray, patchArray } from "sf-core/utils/array";
import { parseCSS, parseCSSStyle } from "sf-html-extension/ast";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { IDOMSection, NodeSection } from "sf-html-extension/dom";
import { ElementAttributeEntityFactory } from "sf-html-extension/dependencies";
import { HTMLElementExpression, HTMLAttributeExpression } from "sf-html-extension/ast";
import { AttributeChangeAction, NODE_ADDED, NODE_REMOVING, PROPERTY_CHANGE } from "sf-core/actions";
import { CSSRuleExpression, CSSStyleExpression, IHTMLElementAttributeEntity } from "sf-html-extension/ast";

export class HTMLElementEntity extends HTMLNodeEntity<HTMLElementExpression> implements IHTMLEntity {

  private _attributes: AttributesBranch;

  patch(entity: HTMLElementEntity) {
    this.patchSelf(entity);
    super.patch(entity);
  }

  protected patchSelf(entity: HTMLElementEntity) {
    const changes = diffArray(this.attributes, entity.attributes, (a, b) => a.constructor === b.constructor && a.source.name === b.source.name);

    for (const add of changes.add) {
      this.attributes.splice(add.index, 0, add.value);
    }

    for (const [oldAttribute, newAttribute] of changes.update) {
      if (oldAttribute.value !== newAttribute.value) {
        oldAttribute.value = newAttribute.value;
      }
    }

    for (const remove of changes.remove) {
      this.attributes.remove(remove);
    }
  }

  async load() {
    await this.loadSelf();
    return super.load();
  }

  protected async loadSelf() {
    for (const attribute of this.source.attributes) {

      let valueEntityFactory = ElementAttributeEntityFactory.findBySource(attribute, this._dependencies) ||
      ElementAttributeEntityFactory.findByName("defaultAttribute", this._dependencies);

      const attributeEntity = valueEntityFactory.create(attribute);
      this.attributes.push(attributeEntity);
      await attributeEntity.load();
      if (this.section instanceof NodeSection) {
        (<Element>this.section.targetNode).setAttribute(attributeEntity.name, attributeEntity.value);
      }
    }
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.LAYER_DEPENDENCY_NAME]: "element"
    });
  }

  get attributes(): AttributesBranch {
    return this._attributes || this._createAttributes();
  }

  get cssRuleExpressions(): Array<CSSRuleExpression> {
    return [];
  }

  createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.source.type));
  }

  static mapSourceChildren(source: HTMLElementExpression) {
    return source.children;
  }

  removeAttribute(name: string) {
    this.attributes.removeByName(name);
  }

  getAttribute(name: string) {
    return this.attributes.get(name);
  }

  setAttribute(name: string, value: any) {
    this.attributes.set(name, value);
  }

  hasAttribute(name: string) {
    return this.attributes.has(name);
  }

  cloneLeaf() {
    const clone = new HTMLElementEntity(this.source);
    this.cloneAttributesToElement(clone);
    return clone;
  }

  protected cloneAttributesToElement(element: HTMLElementEntity) {
    for (const attribute of this.attributes) {
      element.attributes.push(attribute.clone());
    }
  }

  private _createAttributes() {
    const attributes = this._attributes = <AttributesBranch>this.addBranch(new AttributesBranch(this));
    this._attributes.observe(new WrapBus(this.onAttributesAction.bind(this)));
    return this._attributes;
  }

  protected onAttributesAction(action: Action) {
    if (!(this.section instanceof NodeSection)) {
      return;
    }
    const element = <Element>this.section.targetNode;

    if (action.target.name) {
      if (action.type === NODE_REMOVING) {
        element.removeAttribute(action.target.name);
      } else if (action.type === PROPERTY_CHANGE || action.type === NODE_ADDED) {
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
    this.name  = source.name;
    this.value = source.value;
  }

  get hasLoadableValue() {
    return typeof this.source.value === "object";
  }

  async load() {
    await super.load();
    if (this.hasLoadableValue) {
      this.value = (<IValued><any>this.children.first).value;
    }
  }

  mapSourceChildren() {
    return this.hasLoadableValue ? [this.source.value] : [];
  }

  cloneLeaf() {
    return new HTMLAttributeEntity(this.source);
  }
}

export class AttributesBranch extends TreeBranch<HTMLElementEntity, IHTMLElementAttributeEntity> {

  has(name: string) {
    for (const attribute of this) {
      if (attribute.name === name) return true;
    }
    return false;
  }

  get(name: string) {
    for (const attribute of this) {
      if (attribute.name === name) return attribute.value;
    }
  }

  set(name: string, value: any) {
    let found;
    for (const attribute of this) {
      if (attribute.name === name) {
        found = true;
        attribute.value = value;
      }
    }

    if (!found) {
      throw new Error(`Attempting to add new attribute "${name}" to HTML Entity. Modify the source or target node instead.`);
    }
  }

  removeByName(name: string) {
    for (let i = this.length; i--; ) {
      const attribute = this[i];
      if (attribute.name === name) {
        this.splice(i, 1).pop().dispose();
        return;
      }
    }
  }
}


export const defaultAttributeFactoryDependency = new ElementAttributeEntityFactory("defaultAttribute", HTMLAttributeEntity);