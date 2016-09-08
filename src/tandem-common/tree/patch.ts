import { ITreeNode } from "./base";
import { diffArray } from "tandem-common/utils/array";
import { getPatchableProperties } from "tandem-common/decorators";
import { IComparable, IPatchable } from "tandem-common/object";

type ComparableTreeType = ITreeNode<any> & IComparable & IPatchable;

export const patchTreeNode = (oldNode: ComparableTreeType, newNode: ComparableTreeType) => {
  const changes = diffArray(oldNode.children, newNode.children, compareTreeNodes);

  for (const rm of changes.remove) {
    oldNode.removeChild(rm);
  }

  for (const add of changes.add) {
    oldNode.insertChildAt(add.value, add.index);
  }

  for (const [oldChild, newChild, oldIndex, newIndex] of changes.update) {
    patchTreeNode(oldChild, newChild);
    if (oldIndex !== newIndex) {
      oldNode.insertChildAt(oldChild, newIndex);
    }
  }
  patchLeaf(oldNode, newNode);
};

export const compareTreeNodes = (a: ITreeNode<any>, b: ITreeNode<any>): number => {
  if (a.constructor !== b.constructor) return 0;
  let score = 0;
  if ((<IComparable><any>a).compare) {
    score += Number((<IComparable><any>a).compare(<IComparable><any>b));
  }
  return score;
};

export const patchLeaf = (oldNode: ComparableTreeType, newNode: ComparableTreeType) => {

  for (const property of getPatchableProperties(oldNode)) {
    oldNode[property] = newNode[property];
  }

  oldNode.patch(newNode);
};