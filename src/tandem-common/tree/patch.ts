import { ITreeNode } from "./base";
import { diffArray } from "tandem-common/utils/array";
import { getPatchableProperties } from "tandem-common/decorators";
import { IComparable, IPatchable } from "tandem-common/object";

type ComparableTreeType = ITreeNode<any> & IComparable;

export const patchTreeNode = (oldNode: ComparableTreeType, newNode: ComparableTreeType) => {
  const changes = diffArray(oldNode.children, newNode.children, compareTreeNodes);

  for (const rm of changes.remove) {
    oldNode.removeChild(rm);
  }

  for (const add of changes.add) {
    oldNode.insertChildAt(add.value, add.index);
  }

  for (const [oldChild, newChild, newIndex] of changes.update) {
    if (oldNode.children.indexOf(oldChild) !== newIndex) {
      oldNode.insertChildAt(oldChild, newIndex);
    }
    patchTreeNode(oldChild, newChild);
  }

  patchLeaf(oldNode, newNode);
};

export const compareTreeNodes = (a: ITreeNode<any>, b: ITreeNode<any>): number => {
  if (a.constructor !== b.constructor) return 0;
  if ((<IComparable><any>a).compare) {
    return Number((<IComparable><any>a).compare(<IComparable><any>b));
  }
  return 1;
};

export const patchLeaf = (oldNode: ComparableTreeType, newNode: ComparableTreeType) => {
  for (const property of getPatchableProperties(oldNode)) {
    oldNode[property] = newNode[property];
  }

  if (oldNode["patch"]) {
    (<IPatchable><any>oldNode).patch(<IPatchable><any>newNode);
  }
};