import { SyntheticNode } from "index";
import {
  updateNestedNode,
  updateNestedNodeFromPath,
  arraySplice
} from "tandem-common";

export enum SyntheticOperationalTransformType {
  SET_PROPERTY,
  MOVE_CHILD,
  REMOVE_CHILD,
  INSERT_CHILD
}

export type BaseSyntheticOperationalTransform<
  TType extends SyntheticOperationalTransformType
> = {
  nodePath: number[];
  type: TType;
};

export type SyntheticInsertChildOperationalTransform = {
  nodePath: number[];
  index: number;
  child: SyntheticNode;
} & BaseSyntheticOperationalTransform<
  SyntheticOperationalTransformType.INSERT_CHILD
>;

export type SyntheticRemoveChildOperationalTransform = {
  nodePath: number[];
  index: number;
} & BaseSyntheticOperationalTransform<
  SyntheticOperationalTransformType.REMOVE_CHILD
>;

export type SyntheticMoveChildOperationalTransform = {
  nodePath: number[];
  oldIndex: number;
  newIndex: number;
} & BaseSyntheticOperationalTransform<
  SyntheticOperationalTransformType.MOVE_CHILD
>;

export type SyntheticSetPropertyOperationalTransform = {
  nodePath: number[];
  name: string;
  value: any;
} & BaseSyntheticOperationalTransform<
  SyntheticOperationalTransformType.SET_PROPERTY
>;

export type SyntheticOperationalTransform =
  | SyntheticInsertChildOperationalTransform
  | SyntheticRemoveChildOperationalTransform
  | SyntheticMoveChildOperationalTransform
  | SyntheticSetPropertyOperationalTransform;

const createSyntheticInsertChildOperationalTransform = (
  nodePath: number[],
  child: SyntheticNode,
  index: number
): SyntheticInsertChildOperationalTransform => ({
  type: SyntheticOperationalTransformType.INSERT_CHILD,
  nodePath,
  child,
  index
});

const createSyntheticRemoveChildOperationalTransform = (
  nodePath: number[],
  index: number
): SyntheticRemoveChildOperationalTransform => ({
  type: SyntheticOperationalTransformType.REMOVE_CHILD,
  nodePath,
  index
});

const createSyntheticMoveChildOperationalTransform = (
  nodePath: number[],
  oldIndex: number,
  newIndex: number
): SyntheticMoveChildOperationalTransform => ({
  type: SyntheticOperationalTransformType.MOVE_CHILD,
  nodePath,
  oldIndex,
  newIndex
});

const createSyntheticSetPropertyOperationalTransform = (
  nodePath: number[],
  name: string,
  value: any
): SyntheticSetPropertyOperationalTransform => ({
  type: SyntheticOperationalTransformType.SET_PROPERTY,
  nodePath,
  name,
  value
});

const _diffSyntheticNodeMemos = {};

export const diffSyntheticNode = (
  oldNode: SyntheticNode,
  newNode: SyntheticNode
) => {
  const memoKey = oldNode.id + newNode.id;
  return (
    _diffSyntheticNodeMemos[memoKey] ||
    (_diffSyntheticNodeMemos[memoKey] = _diffSyntheticNode(
      oldNode,
      newNode,
      []
    ))
  );
};

export const _diffSyntheticNode = (
  oldNode: SyntheticNode,
  newNode: SyntheticNode,
  nodePath: number[],
  ots: SyntheticOperationalTransform[] = []
): SyntheticOperationalTransform[] => {
  const memoKey = oldNode.id + newNode.id;
  if (_diffSyntheticNodeMemos[memoKey]) {
    return _diffSyntheticNodeMemos[memoKey];
  }

  for (const key in newNode) {
    if (key === "children") {
      continue;
    }
    const oldValue = oldNode[key];
    const newValue = oldNode[key];

    if (
      oldValue !== newValue ||
      (typeof newValue === "object" &&
        JSON.stringify(oldValue) !== JSON.stringify(newValue))
    ) {
      ots.push(
        createSyntheticSetPropertyOperationalTransform(nodePath, key, newValue)
      );
    }
  }

  const modelChildren = [...oldNode.children] as SyntheticNode[];
  const oldChildIds = {};

  // DELETE
  for (let i = oldNode.children.length; i--; ) {
    let found: SyntheticNode;
    let foundIndex: number;
    const oldChild = oldNode[i];
    oldChildIds[oldChild.source.nodeId] = 1;

    for (let j = newNode.children.length; j--; ) {
      const newChild = newNode.children[j] as SyntheticNode;
      if (newChild.source.nodeId === oldChild.source.nodeId) {
        found = newChild;
        foundIndex = j;
        break;
      }
    }

    const oldIndex = modelChildren.indexOf(oldChild);

    if (found) {
      _diffSyntheticNode(
        oldChild,
        found,
        [...nodePath, modelChildren.indexOf(oldChild)],
        ots
      );
      if (foundIndex !== i) {
        modelChildren.splice(oldIndex, 1);
        modelChildren.splice(foundIndex, 0, oldChild);
        ots.push(
          createSyntheticMoveChildOperationalTransform(
            nodePath,
            oldIndex,
            foundIndex
          )
        );
      }
    } else {
      ots.push(
        createSyntheticRemoveChildOperationalTransform(nodePath, oldIndex)
      );
      modelChildren.splice(oldIndex, 1);
    }
  }

  for (let i = 0, { length } = newNode.children; i < length; i++) {
    const child = newNode[i];
    if (!oldChildIds[child.source.nodeId]) {
      ots.push(
        createSyntheticInsertChildOperationalTransform(nodePath, child, i)
      );
    }
  }

  return ots;
};

export const patchSyntheticNode = (
  ots: SyntheticOperationalTransform[],
  oldNode: SyntheticNode
) =>
  ots.reduce((node, ot) => {
    return updateNestedNodeFromPath(
      ot.nodePath,
      node,
      (target: SyntheticNode) => {
        switch (ot.type) {
          case SyntheticOperationalTransformType.SET_PROPERTY: {
            return {
              ...target,
              [ot.name]: ot.value
            };
          }
          case SyntheticOperationalTransformType.INSERT_CHILD: {
            return {
              ...node,
              children: arraySplice(target.children, ot.index, 0, ot.child)
            };
          }
          case SyntheticOperationalTransformType.REMOVE_CHILD: {
            return {
              ...node,
              children: arraySplice(target.children, ot.index, 1)
            };
          }
          case SyntheticOperationalTransformType.MOVE_CHILD: {
            return {
              ...node,
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
