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
  PCVariableType,
  isComponentOrInstance,
  PCSourceTagNames,
  PCComponent,
  extendsComponent,
  isPCComponentOrInstance,
  PCElement
} from "paperclip";
import {defaults} from "lodash";
import { memoize, getParentTreeNode, KeyValue } from "tandem-common";
import { ColorSwatchOption } from "../../../../inputs/color/color-swatch-controller";

export type ComputedStyleInfo = {
  sourceNodes: (PCVisibleNode | PCComponent)[];
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
    const sourceNodes: (PCVisibleNode | PCComponent)[] = [];
    const styleOverridesMap: KeyValue<PCStyleOverride[]> = {};


    for (const inspectorNode of selectedInspectorNodes) {
      const sourceNode = getPCNode(
        inspectorNode.assocSourceNodeId,
        graph
      ) as PCVisibleNode | PCComponent;
      sourceNodes.push(sourceNode);
      let current: PCNode = sourceNode;
      while(extendsComponent(current)) {
        const parent: PCElement
         = getPCNode((current as PCComponent).is, graph) as PCElement;
        if (isPCComponentOrInstance(parent)) {

          // defaults -- parents cannot disable
          defaults(style, parent.style);
        }
        current = parent;
      }
      
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
