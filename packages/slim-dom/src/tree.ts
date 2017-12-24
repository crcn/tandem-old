import { SlimVMObjectType, SlimCSSMediaRule, SlimBaseNode, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimParentNode, SlimStyleElement, SlimTextNode, VMObject } from "./state";

const treeMemoKey = Symbol();

export const getVMObjectTree = (target: VMObject, parent?: VMTree) => {

  const tree: VMTree = target[treeMemoKey] && target[treeMemoKey].target === target ? target[treeMemoKey] : new VMTree(target);

  if (parent) {
    tree.$$parent = parent;
  }

  return target[treeMemoKey] = tree;
};

class VMTree {

  private _target: VMObject;
  public $$parent: VMTree;
  private _shadow: VMTree;
  private _flattened: VMTree[];
  private _objectsById: {
    [identifier: string]: VMObject[]
  }
  private _children: VMTree[];

  constructor(target: VMObject) {
    this._target = target;
    if ((target as SlimParentNode).childNodes) {
      this._children = (target as SlimParentNode).childNodes.map(child => getVMObjectTree(child, this));
    }

    if ((target as SlimElement).shadow) {
      this._shadow = getVMObjectTree((target as SlimElement).shadow, this);
    }
  }

  flatten() {
    if (this._flattened) {
      return this._flattened;
    }
    this._flattened = [this];
    if (this._shadow) {
      this._flattened.push(...this._shadow.flatten());
    }
    if (this._children) {
      for (let i = 0, {length} = this._children; i < length; i++) {
        this._flattened.push(...this._children[i].flatten());
      }
    }
    return this._flattened;
  }

  getNestedTreeById(id: string) {
    return this.flatten().find(tree => tree._target.id === id);
  }

  get shadow() {
    return this._shadow;
  }

  get children() {
    return this._children;
  }

  get target() {
    return this._target;
  }

  get parent() {
    return this.$$parent;
  }

  get path() {
    let current: VMTree = this;
    let parent = this.$$parent;
    let path: any[] = [];

    while(parent) {
      if (parent.shadow === current) {
        path.unshift("shadow");
      } else {
        path.unshift(parent._children.indexOf(current));
      }
      current = parent;
      parent = parent.$$parent;
    }

    return path;
  }
}