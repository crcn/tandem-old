import { ITreeNode } from "./base";
import { IComparable, IPatchable } from "sf-core/object";
import { diffArray } from "sf-core/utils/array";

type ComparableTreeType = ITreeNode<any> & IComparable & IPatchable;

export const patchTreeNode = (oldNode: ComparableTreeType, newNode: ComparableTreeType) => {
  patchLeaf(oldNode, newNode);

  const changes = diffArray(oldNode.children, newNode.children, compareTreeNodes);

  for (const rm of changes.remove) {
    oldNode.removeChild(rm);
  }

  for (const add of changes.add) {
    oldNode.insertAt(add.value, add.index);
  }

  for (const [oldChild, newChild, oldIndex, newIndex] of changes.update) {
    patchTreeNode(oldChild, newChild);
    if (oldIndex !== newIndex) {
      oldNode.insertAt(oldChild, newIndex);
    }
  }
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
  oldNode.patch(newNode);
};