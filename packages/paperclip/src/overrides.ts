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
  EMPTY_ARRAY,
  generateUID
} from "tandem-common";
import { uniq, defaults } from "lodash";

export const COMPUTED_OVERRIDE_DEFAULT_KEY = "default";

export enum ComputedOverrideType {
  STYLE = "style",
  ATTRIBUTES = "attributes",
  TEXT = "text",
  VARIANT = "variant"
}

export type BaseComputedOverride<TType extends ComputedOverrideType, TValue> = {
  id: string;
  source: PCOverride;
  type: TType;
  value: TValue;
  variantId: string;
};

export type ComputedStyleOverride = BaseComputedOverride<
  ComputedOverrideType.STYLE,
  KeyValue<string>
>;
export type ComputedAttributesOverride = BaseComputedOverride<
  ComputedOverrideType.ATTRIBUTES,
  KeyValue<string>
>;
export type ComputedTextOverride = BaseComputedOverride<
  ComputedOverrideType.TEXT,
  string
>;
export type ComputedVariantOverride = BaseComputedOverride<
  ComputedOverrideType.VARIANT,
  string[]
>;

export type ComputedOverride =
  | ComputedStyleOverride
  | ComputedAttributesOverride
  | ComputedTextOverride
  | ComputedVariantOverride;

export type ComputedOverrideMap = {
  [COMPUTED_OVERRIDE_DEFAULT_KEY]: ComputedOverrideVariantMap;

  // variant id
  [identifier: string]: ComputedOverrideVariantMap;
};

export type ComputedOverrideVariantMap = {
  // target node id
  [identifier: string]: ComputedNodeOverrideMap;
};

export type ComputedNodeOverrideMap = {
  overrides: ComputedOverride[];
  children: ComputedOverrideVariantMap;
};

export const getOverrideMap = memoize(
  (node: PCNode, contentNode: PCNode, includeSelf?: boolean) => {
    const map: ComputedOverrideMap = {
      default: {}
    };

    const overrides = uniq([
      ...getOverrides(node),
      ...getOverrides(contentNode).filter(override => {
        return override.targetIdPath.indexOf(node.id) !== -1;
      })
    ]) as PCOverride[];

    for (const override of overrides) {
      const computedOverrides = computePCOverride(override);

      for (const computedOverride of computedOverrides) {
        if (!map[computedOverride.variantId]) {
          map[override.variantId] = {};
        }

        let targetOverrides: any;

        if (!(targetOverrides = map[computedOverride.variantId])) {
          targetOverrides = map[computedOverride.variantId] = {};
        }

        const targetIdPath = [...computedOverride.source.targetIdPath];
        const targetId = targetIdPath.pop() || node.id;
        if (
          includeSelf &&
          computedOverride.source.targetIdPath.length &&
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

        targetOverrides[targetId].overrides.push(computedOverride);
      }
    }

    return map;
  }
);

export const computePCOverride = memoize(
  (override: PCOverride): ComputedOverride[] => {
    if (override.type === PCOverridableType.STYLES)
      return computeStyleOverride(override);
    if (override.type === PCOverridableType.ATTRIBUTES)
      return computeAttributesOverride(override);
    if (override.type === PCOverridableType.TEXT)
      return computeTextOverride(override);
    if (override.type === PCOverridableType.VARIANT)
      return computeVariantOverride(override);
    console.error(`Cannot compute ${override.type}`);
    return EMPTY_ARRAY;
  }
);

export const computePCOverrides = memoize(
  (overrides: PCOverride[]): ComputedOverride[] => {
    return overrides.reduce(
      (computedOverrides, override) => [
        ...computedOverrides,
        ...computePCOverride(override)
      ],
      EMPTY_ARRAY
    );
  }
);

const computeStyleOverride = (
  override: PCStylesOverride
): ComputedStyleOverride[] => {
  const computedOverrides = {};
  for (const block of override.value) {
    const variantId = block.variantId || COMPUTED_OVERRIDE_DEFAULT_KEY;
    if (!computedOverrides[variantId]) {
      (computedOverrides[variantId] as ComputedStyleOverride) = {
        id: generateUID(),
        source: override,
        type: ComputedOverrideType.STYLE,
        value: {},
        variantId
      };
    }

    defaults(
      computedOverrides[variantId].value,
      keyValuePairToHash(block.properties)
    );
  }

  return Object.values(computedOverrides);
};

const computeAttributesOverride = (
  override: PCAddAttributesOverride
): ComputedAttributesOverride[] => {
  return [
    {
      id: generateUID(),
      type: ComputedOverrideType.ATTRIBUTES,
      value: keyValuePairToHash(override.value),
      variantId: override.variantId || COMPUTED_OVERRIDE_DEFAULT_KEY,
      source: override
    }
  ];
};

const computeTextOverride = (
  override: PCTextOverride
): ComputedTextOverride[] => {
  return [
    {
      id: generateUID(),
      type: ComputedOverrideType.TEXT,
      value: override.value,
      variantId: override.variantId || COMPUTED_OVERRIDE_DEFAULT_KEY,
      source: override
    }
  ];
};

const computeVariantOverride = (
  override: PCVariant2Override
): ComputedVariantOverride[] => {
  return [
    {
      id: generateUID(),
      type: ComputedOverrideType.VARIANT,
      value: override.value,
      variantId: override.variantId || COMPUTED_OVERRIDE_DEFAULT_KEY,
      source: override
    }
  ];
};

export const mergeVariantOverrides = (variantMap: ComputedOverrideMap) => {
  let map: ComputedOverrideVariantMap = {};
  for (const variantId in variantMap) {
    map = mergeVariantOverrides2(variantMap[variantId], map);
  }

  return map;
};

const mergeVariantOverrides2 = (
  oldMap: ComputedOverrideVariantMap,
  existingMap: ComputedOverrideVariantMap
) => {
  let newMap: ComputedOverrideVariantMap = { ...existingMap };
  for (const key in oldMap) {
    newMap[key] = {
      overrides: existingMap[key]
        ? [...existingMap[key].overrides, ...oldMap[key].overrides]
        : oldMap[key].overrides,
      children: mergeVariantOverrides2(
        oldMap[key].children,
        (existingMap[key] || EMPTY_OBJECT).children || EMPTY_OBJECT
      )
    };
  }

  return newMap;
};

export const flattenPCOverrideMap = memoize(
  (
    map: ComputedOverrideVariantMap,
    idPath: string[] = [],
    flattened: KeyValue<ComputedOverride[]> = {}
  ): KeyValue<ComputedOverride[]> => {
    for (const nodeId in map) {
      flattened[[...idPath, nodeId].join(" ")] = map[nodeId].overrides;
      flattenPCOverrideMap(
        map[nodeId].children,
        [...idPath, nodeId],
        flattened
      );
    }
    return flattened;
  }
);
