import * as React from "react";
import * as cx from "classnames";
import { compose, pure } from "recompose";
import {
  SyntheticNode,
  PCNode,
  isComponent,
  isPCComponentInstance,
  PCSourceTagNames
} from "paperclip";

export type LayerControllerOuterProps = {
  depth?: number;
  sourceNode: PCNode;
  alt: boolean;
  syntheticNode: SyntheticNode;
};

export default compose(
  pure,
  Base => ({
    depth = 1,
    alt,
    sourceNode,
    syntheticNode
  }: LayerControllerOuterProps) => {
    return (
      <span>
        <Base
          variant={cx({
            component: sourceNode.name === PCSourceTagNames.COMPONENT,
            instance: sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE,
            element: sourceNode.name === PCSourceTagNames.ELEMENT,
            text: sourceNode.name === PCSourceTagNames.TEXT,
            slot: false,
            shadow: false
          })}
          labelProps={{
            text: syntheticNode.label
          }}
          style={{ paddingLeft: depth * 16 }}
        />
      </span>
    );
  }
);
