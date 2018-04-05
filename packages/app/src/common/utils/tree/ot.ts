import {TreeNode} from "../../state/tree";

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