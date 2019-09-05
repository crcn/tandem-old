import {
  PCOverride,
  PCNode,
  getOverrides,
  PCStylesOverride,
  PCOverridableType,
  PCAddAttributesOverride,
  PCTextOverride,
  PCVariant2Override
} from "./dsl";
import {
  getNestedTreeNodeById,
  memoize,
  KeyValue,
  EMPTY_OBJECT,
  keyValuePairToHash,
  EMPTY_ARRAY
} from "tandem-common";
import { uniq } from "lodash";

export type ComputedOverrideMap = {
  // target node id
  [identifier: string]: ComputedNodeOverrideMap;
};

export type ComputedNodeOverrideMap = {
  overrides: PCOverride[];

  // TODO - change to decendents
  children: ComputedOverrideMap;
};

export const overridesToTargetMap = memoize(
  (overrides: PCOverride[]): ComputedOverrideMap => {
    let rootMap: ComputedOverrideMap = {};
    for (const override of overrides) {
      let currentMap = rootMap;
      const instancePath = [...override.targetIdPath];
      const targetId = instancePath.pop();
      for (const nodeId of instancePath) {
        if (!currentMap[nodeId]) {
          currentMap[nodeId] = {
            overrides: [],
            children: {}
          };
        }

        currentMap = currentMap[nodeId].children;
      }

      if (!currentMap[targetId]) {
        currentMap[targetId] = {
          overrides: [],
          children: {}
        };
      }

      currentMap[targetId].overrides.push(override);
    }

    return rootMap;
  }
);

// DEPRECATED
export const getOverrideMap = memoize(
  (node: PCNode, contentNode: PCNode, includeSelf?: boolean) => {
    const map: ComputedOverrideMap = {};

    const overrides = uniq([
      ...getOverrides(node),
      ...getOverrides(contentNode).filter(override => {
        return override.targetIdPath.indexOf(node.id) !== -1;
      })
    ]) as PCOverride[];

    for (const override of overrides) {
      let targetOverrides = map;

      const targetIdPath = [...override.targetIdPath];
      const targetId = targetIdPath.pop() || node.id;
      if (
        includeSelf &&
        override.targetIdPath.length &&
        !getNestedTreeNodeById(targetId, node)
      ) {
        targetIdPath.unshift(node.id);
      }

      for (const nodeId of targetIdPath) {
        if (!targetOverrides[nodeId]) {
          targetOverrides[nodeId] = {
            overrides: [],
            children: {}
          };
        }

        targetOverrides = targetOverrides[nodeId].children;
      }

      if (!targetOverrides[targetId]) {
        targetOverrides[targetId] = {
          overrides: [],
          children: {}
        };
      }

      targetOverrides[targetId].overrides.push(override);
    }

    return map;
  }
);
