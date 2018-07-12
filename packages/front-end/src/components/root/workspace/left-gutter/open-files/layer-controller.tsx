import * as React from "react";
import * as cx from "classnames";
import { compose, pure } from "recompose";
import {
  SyntheticNode,
  PCNode,
  PCSourceTagNames,
  getPCNode,
  extendsComponent,
  DependencyGraph
} from "paperclip";

export type LayerControllerOuterProps = {
  depth?: number;
  graph: DependencyGraph;
  sourceNode: PCNode;
  syntheticNode: SyntheticNode;
};

const EnhancedLayer = compose<
  LayerControllerOuterProps,
  LayerControllerOuterProps
>(
  pure,
  Base => ({
    graph,
    depth = 1,
    sourceNode,
    syntheticNode
  }: LayerControllerOuterProps) => {
    const expanded = true;
    let children;

    if (expanded) {
      const childDepth = depth + 1;
      if (
        sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE ||
        (sourceNode.name === PCSourceTagNames.COMPONENT &&
          extendsComponent(sourceNode))
      ) {
        children = [
          <EnhancedLayer
            key="shadow"
            depth={childDepth}
            sourceNode={getPCNode(sourceNode.id, graph)}
            graph={graph}
            syntheticNode={null}
          />
        ];
      } else {
        children = sourceNode.children.map(child => {
          return (
            <EnhancedLayer
              key={child.id}
              depth={childDepth}
              sourceNode={child}
              graph={graph}
            />
          );
        });
      }
    }
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
            text: syntheticNode && syntheticNode.label
          }}
          style={{ paddingLeft: depth * 16 }}
        />
        {children}
      </span>
    );
  }
) as any;

export default EnhancedLayer;
