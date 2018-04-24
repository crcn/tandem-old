import {TreeNode, updateNestedNodeFromPath, setNodeAttribute} from "../../state/tree";
import { EMPTY_OBJECT } from "../object";
import { BADFAMILY } from "dns";

// to add namespace, import with import * as tree from "utils/tree";

/**
 * Operational transforms
 */

export enum OperationalTransformType {
  REMOVE_NODE = "REMOVE_NODE",
  SET_ATTRIBUTE = "SET_ATTRIBUTE"
};

export type OperationalTransform = {
  type: OperationalTransformType;
  path: number[];
};

export type SetAttributeTransform = {
  name: string;
  namespace: string;
  value: any;
} & OperationalTransform;

export const createSetAttributeTransform = (path: number[], name: string, namespace: string, value: any): SetAttributeTransform => ({
  type: OperationalTransformType.SET_ATTRIBUTE,
  path,
  name,
  namespace,
  value
});

export const diffNode = (a: TreeNode, b: TreeNode, path: number[] = [], diffs: OperationalTransform[] = []) => {

  // delete & update
  for (const namespace in a.attributes) {
    const aatts = a.attributes[namespace];
    const batts = b.attributes[namespace] || EMPTY_OBJECT;

    for (const name in aatts) {
      const newValue = batts[name];
      const oldValue = aatts[name];
      if (oldValue !== newValue) {
        diffs.push(createSetAttributeTransform(path, name, namespace, newValue));
      }
    }
  }

  // insert
  for (const namespace in b.attributes) {
    const aatts = a.attributes[namespace] || EMPTY_OBJECT;
    const batts = b.attributes[namespace];

    for (const name in aatts) {
      const newValue = batts[name];
      const oldValue = aatts[name];
      if (oldValue == null) {
        diffs.push(createSetAttributeTransform(path, name, namespace, newValue));
      }
    }
  }

  for (let i = Math.min(a.children.length, b.children.length); i--;) {
    diffNode(a.children[i], b.children[i], [...path, i], diffs);
  }

  // insert


  return diffs;
};

export const patchNode = <TNode extends TreeNode>(ots: OperationalTransform[], a: TNode): TNode => {
  let b = a;

  for (const ot of ots) {
    switch(ot.type) {
      case OperationalTransformType.SET_ATTRIBUTE: {
        const { path, name, namespace, value } = ot as SetAttributeTransform;
        b = updateNestedNodeFromPath(path, b, (child) => setNodeAttribute(child, name, value, namespace));
        break;
      }
    }
  }

  return b;
};