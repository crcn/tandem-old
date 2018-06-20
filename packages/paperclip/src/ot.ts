import {
  SyntheticVisibleNode,
  SyntheticBaseNode
} from "./synthetic";
import {
  updateNestedNode,
  updateNestedNodeFromPath,
  arraySplice,
  memoize,
  diffArray,
  ArrayOperationalTransformType,
  ArrayDeleteMutation,
  ArrayUpdateMutation,
  ArrayInsertMutation
} from "tandem-common";
import { PCNode } from "./dsl";

export enum TreeNodeOperationalTransformType {
  SET_PROPERTY,
  MOVE_CHILD,
  REMOVE_CHILD,
  INSERT_CHILD
}

export type BaseTreeNodeOperationalTransform<
  TType extends TreeNodeOperationalTransformType
> = {
  nodePath: number[];
  type: TType;
};

export type InsertChildNodeOperationalTransform = {
  nodePath: number[];
  index: number;
  child: SyntheticVisibleNode | PCNode;
} & BaseTreeNodeOperationalTransform<
  TreeNodeOperationalTransformType.INSERT_CHILD
>;

export type RemoveChildNodeOperationalTransform = {
  nodePath: number[];
  index: number;
} & BaseTreeNodeOperationalTransform<
  TreeNodeOperationalTransformType.REMOVE_CHILD
>;

export type MoveChildNodeOperationalTransform = {
  nodePath: number[];
  oldIndex: number;
  newIndex: number;
} & BaseTreeNodeOperationalTransform<
  TreeNodeOperationalTransformType.MOVE_CHILD
>;

export type SetNodePropertyOperationalTransform = {
  nodePath: number[];
  name: string;
  value: any;
} & BaseTreeNodeOperationalTransform<
  TreeNodeOperationalTransformType.SET_PROPERTY
>;

export type TreeNodeOperationalTransform =
  | InsertChildNodeOperationalTransform
  | RemoveChildNodeOperationalTransform
  | MoveChildNodeOperationalTransform
  | SetNodePropertyOperationalTransform;

const createInsertChildNodeOperationalTransform = (
  nodePath: number[],
  child: SyntheticVisibleNode | PCNode,
  index: number
): InsertChildNodeOperationalTransform => ({
  type: TreeNodeOperationalTransformType.INSERT_CHILD,
  nodePath,
  child,
  index
});

const createRemoveChildNodeOperationalTransform = (
  nodePath: number[],
  index: number
): RemoveChildNodeOperationalTransform => ({
  type: TreeNodeOperationalTransformType.REMOVE_CHILD,
  nodePath,
  index
});

const createMoveChildNodeOperationalTransform = (
  nodePath: number[],
  oldIndex: number,
  newIndex: number
): MoveChildNodeOperationalTransform => ({
  type: TreeNodeOperationalTransformType.MOVE_CHILD,
  nodePath,
  oldIndex,
  newIndex
});

const createSetNodePropertyOperationalTransform = (
  nodePath: number[],
  name: string,
  value: any
): SetNodePropertyOperationalTransform => ({
  type: TreeNodeOperationalTransformType.SET_PROPERTY,
  nodePath,
  name,
  value
});

const _diffTreeNodeMemos = {};

export const diffTreeNode = memoize(
  (oldNode: SyntheticBaseNode | PCNode, newNode: SyntheticBaseNode | PCNode) => {
    const ots = _diffTreeNode(oldNode, newNode, []);
    return ots;
  }
);

const PROHIBITED_DIFF_KEYS = {
  children: true,
  id: true,
  metadata: true
};

const _diffTreeNode = (
  oldNode: SyntheticBaseNode | PCNode,
  newNode: SyntheticBaseNode | PCNode,
  nodePath: number[],
  ots: TreeNodeOperationalTransform[] = []
): TreeNodeOperationalTransform[] => {
  if (oldNode === newNode) {
    return ots;
  }
  const memoKey = oldNode.id + newNode.id;
  if (_diffTreeNodeMemos[memoKey]) {
    return _diffTreeNodeMemos[memoKey];
  }

  for (const key in newNode) {
    if (PROHIBITED_DIFF_KEYS[key]) {
      continue;
    }
    const oldValue = oldNode[key];
    const newValue = newNode[key];

    if (
      oldValue !== newValue &&
      !(
        typeof newValue === "object" &&
        JSON.stringify(oldValue) === JSON.stringify(newValue)
      )
    ) {
      ots.push(
        createSetNodePropertyOperationalTransform(nodePath, key, newValue)
      );
    }
  }

  const childOts = diffArray(
    oldNode.children as SyntheticVisibleNode[],
    newNode.children as SyntheticVisibleNode[],
    (a, b) => ((a.source ? a.source.nodeId === b.source.nodeId : a.id === b.id) ? 0 : -1)
  );

  for (const ot of childOts) {
    if (ot.type === ArrayOperationalTransformType.DELETE) {
      ots.push(
        createRemoveChildNodeOperationalTransform(
          nodePath,
          (ot as ArrayDeleteMutation).index
        )
      );
    } else if (ot.type === ArrayOperationalTransformType.UPDATE) {
      const uot = ot as ArrayUpdateMutation<any>;
      const oldChild = oldNode.children[
        uot.originalOldIndex
      ] as SyntheticVisibleNode;

      _diffTreeNode(
        oldChild,
        uot.newValue,
        [...nodePath, uot.patchedOldIndex],
        ots
      );

      if (uot.index !== uot.patchedOldIndex) {
        ots.push(
          createMoveChildNodeOperationalTransform(
            nodePath,
            uot.originalOldIndex,
            uot.index
          )
        );
      }
    } else if (ot.type === ArrayOperationalTransformType.INSERT) {
      const iot = ot as ArrayInsertMutation<any>;
      ots.push(
        createInsertChildNodeOperationalTransform(
          nodePath,
          iot.value,
          iot.index
        )
      );
    }
  }

  return ots;
};

export const patchTreeNode = (
  ots: TreeNodeOperationalTransform[],
  oldNode: SyntheticBaseNode | PCNode
) => {
  return ots.reduce((node, ot) => {
    return updateNestedNodeFromPath(
      ot.nodePath,
      node,
      (target: SyntheticVisibleNode) => {
        switch (ot.type) {
          case TreeNodeOperationalTransformType.SET_PROPERTY: {
            return {
              ...target,
              [ot.name]: ot.value
            };
          }
          case TreeNodeOperationalTransformType.INSERT_CHILD: {
            return {
              ...target,
              children: arraySplice(target.children, ot.index, 0, ot.child)
            };
          }
          case TreeNodeOperationalTransformType.REMOVE_CHILD: {
            return {
              ...target,
              children: arraySplice(target.children, ot.index, 1)
            };
          }
          case TreeNodeOperationalTransformType.MOVE_CHILD: {
            return {
              ...target,
              children: arraySplice(
                arraySplice(target.children, ot.oldIndex, 1),
                ot.newIndex,
                0,
                target.children[ot.oldIndex]
              )
            };
          }
        }
      }
    );
  }, oldNode);