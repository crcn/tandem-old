import {
  PCNode,
  PCVisibleNode,
  PCStyleBlock,
  INHERITABLE_STYLE_NAMES,
  isVisibleNode,
  PCSourceTagNames,
  PCComponent
} from "./dsl";
import { memoize, getParentTreeNode } from "tandem-common";
import {
  InspectorNode,
  getInspectorSourceNode,
  getInspectorNodeOverrides
} from "./inspector";
import { DependencyGraph } from "./graph";
import { inherits } from "util";

export type ComputedStyleProperty = {
  key?: string;
  value?: string;
  inherited: boolean;
  overridden: boolean;
  enabled: boolean; // style is being applied on element
};

export type ComputedStyleBlock = {
  owner: PCVisibleNode;
  block: PCStyleBlock;
  properties: ComputedStyleProperty[];
};

export const computeStyleBlocks = memoize(
  (
    node: InspectorNode,
    root: InspectorNode,
    graph: DependencyGraph,
    includeSelf: boolean = true
  ) => {
    const computedStyleBlocks: ComputedStyleBlock[] = [];
    const sourceNode = getInspectorSourceNode(
      node,
      root,
      graph
    ) as PCVisibleNode;

    if (includeSelf) {
      for (const block of sourceNode.styles) {
        computedStyleBlocks.push({
          block,
          owner: sourceNode,
          properties: block.properties.map(({ key, value }) => ({
            key,
            value,
            inherited: false,
            overridden: false,
            enabled: true
          }))
        });
      }
    }

    const overrides = getInspectorNodeOverrides(node, root, null, graph);

    const parent = getParentTreeNode(node.id, root) as InspectorNode;

    const parentSourceNode = getInspectorSourceNode(parent, root, graph);

    if (
      isVisibleNode(parentSourceNode) ||
      parentSourceNode.name === PCSourceTagNames.COMPONENT
    ) {
      for (const block of parentSourceNode.styles) {
        if (styleBlockContainsInheritedProps(block)) {
          const computedStyleBlock: ComputedStyleBlock = {
            block,
            owner: parentSourceNode as PCVisibleNode,
            properties: block.properties.map(({ key, value }) => ({
              key,
              value,
              inherited: INHERITABLE_STYLE_NAMES.indexOf(key) !== -1,
              overridden: false,
              enabled: true
            }))
          };
          computedStyleBlocks.push(computedStyleBlock);
        }
      }
    }

    if (parentSourceNode.name !== PCSourceTagNames.MODULE) {
      computedStyleBlocks.push(
        ...computeStyleBlocks(parent, root, graph, false)
      );
    }

    return computedStyleBlocks;
  }
);

const styleBlockContainsInheritedProps = memoize((block: PCStyleBlock) => {
  return block.properties.some(
    ({ key }) => INHERITABLE_STYLE_NAMES.indexOf(key) !== -1
  );
});

// export const computeStyleBlocks = memoize(
//   (
//     node: PCVisibleNode | PCComponent,
//     root: PCVisibleNode | PCComponent,
//     self: boolean = true
//   ): ComputedStyleBlock[] => {
//     const computedStyleBlocks = [];

//     if (self) {
//       const used = {};

//       computedStyleBlocks.push({
//         sourceNode: node,
//         properties: node.styles.reduce((props, properties: { key, value }) => {
//           for (const {key, value} of properties) {
//             const ret = {
//               key,
//               value,
//               inherited: false,
//               overridden: !used[key],
//               enabled: true
//             };

//             used[key] = 1;
//           }
//           return ret;
//         }, {})
//       });
//     }

//     // TODO - compute mixins

//     return computedStyleBlocks;
//   }
// );
