import { PCNode, PCVisibleNode, PCComponent } from "./dsl";
import { memoize } from "tandem-common";

export type ComputedStyleProperty = {
  key?: string;
  value?: string;
  inherited: boolean;
  overridden: boolean;
  enabled: boolean; // style is being applied on element
};

export type ComputedStyleBlock = {
  sourceNode: PCNode;
  properties: ComputedStyleProperty[];
};

export const computeStyleBlocks = memoize(
  (
    node: PCVisibleNode | PCComponent,
    root: PCVisibleNode | PCComponent,
    self: boolean = true
  ): ComputedStyleBlock[] => {
    const computedStyleBlocks = [];

    if (self) {
      const used = {};

      computedStyleBlocks.push({
        sourceNode: node,
        properties: node.style.map(({ key, value }) => {
          const ret = {
            key,
            value,
            inherited: false,
            overridden: !used[key],
            enabled: true
          };

          used[key] = 1;
          return ret;
        })
      });
    }

    // TODO - compute mixins

    return computedStyleBlocks;
  }
);
