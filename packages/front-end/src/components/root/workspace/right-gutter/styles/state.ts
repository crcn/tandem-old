import {
  PCNode,
  PCVisibleNode,
  InspectorNode,
  DependencyGraph,
  getPCNode,
  getInspectorSourceNode,
  PCOverride,
  getOverrides,
  PCVariant,
  getInspectorNodeOverrides,
  PCOverridablePropertyName,
  PCStyleOverride,
  PCVariable,
  PCVariableType
} from "paperclip";
import { memoize, getParentTreeNode, KeyValue } from "tandem-common";
import { last } from "lodash";
import { ColorSwatchOption } from "../../../../inputs/color/color-swatch-controller";

export type ComputedStyleInfo = {
  sourceNodes: PCVisibleNode[];
  styleOverridesMap: KeyValue<PCStyleOverride[]>;
  style: {
    [identifier: string]: string;
  };
};

export const computeStyleInfo = memoize(
  (
    selectedInspectorNodes: InspectorNode[],
    rootInspectorNode: InspectorNode,
    variant: PCVariant,
    graph: DependencyGraph
  ): ComputedStyleInfo => {
    const style = {};
    const sourceNodes: PCVisibleNode[] = [];
    const styleOverridesMap: KeyValue<PCStyleOverride[]> = {};

    for (const inspectorNode of selectedInspectorNodes) {
      const sourceNode = getPCNode(
        inspectorNode.assocSourceNodeId,
        graph
      ) as PCVisibleNode;
      sourceNodes.push(sourceNode);
      const overrides = getInspectorNodeOverrides(
        inspectorNode,
        rootInspectorNode,
        variant,
        graph
      );

      Object.assign(style, sourceNode.style);
      for (const override of overrides) {
        if (override.propertyName === PCOverridablePropertyName.STYLE) {
          for (const key in override.value) {
            if (!styleOverridesMap[key]) {
              styleOverridesMap[key] = [];
            }
            styleOverridesMap[key].push(override);
            style[key] = override.value[key];
          }
        }
      }
    }

    return {
      sourceNodes,
      styleOverridesMap,
      style
    };
  }
);

export const mapPCVariablesToColorSwatchOptions = memoize(
  (globalVariables: PCVariable[]): ColorSwatchOption[] => {
    return globalVariables
      .filter(variable => variable.type === PCVariableType.COLOR)
      .map(variable => ({
        color: variable.value,
        value: `--${variable.id}`
      }));
  }
);
