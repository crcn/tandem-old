import * as React from "react";
import * as path from "path";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";
import {
  SyntheticNode,
  PCSourceTagNames,
  getPCNode,
  DependencyGraph,
  PCVisibleNode,
  getPCNodeDependency,
  SyntheticDocument
} from "paperclip";
import {
  InspectorNode,
  InspectorTreeNodeType
} from "../../../../../state/pc-inspector-tree";
import { Dispatch } from "redux";
import {
  sourceInspectorLayerClicked,
  sourceInspectorLayerArrowClicked
} from "../../../../../actions";

export type LayerControllerOuterProps = {
  depth?: number;
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
  selectedPaths: string[];
  document: SyntheticDocument;
  inspectorNode: InspectorNode;
  syntheticNode: SyntheticNode;
};

type LayerControllerInnerProps = {
  onLabelClick: () => any;
  onArrowButtonClick: () => any;
} & LayerControllerOuterProps;

export default Base => {
  let EnhancedLayer;

  const enhance = compose<LayerControllerOuterProps, LayerControllerOuterProps>(
    pure,
    withHandlers({
      onLabelClick: ({ dispatch, inspectorNode }) => (
        event: React.MouseEvent<any>
      ) => {
        dispatch(sourceInspectorLayerClicked(inspectorNode, event));
      },
      onArrowButtonClick: ({ dispatch, inspectorNode }) => (
        event: React.MouseEvent<any>
      ) => {
        event.stopPropagation();
        dispatch(sourceInspectorLayerArrowClicked(inspectorNode, event));
      }
    }),
    Base => ({
      graph,
      depth = 1,
      dispatch,
      document,
      onLabelClick,
      selectedPaths,
      inspectorNode,
      onArrowButtonClick
    }: LayerControllerInnerProps) => {
      const expanded = inspectorNode.expanded;
      const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
      const isSourceRep =
        inspectorNode.name === InspectorTreeNodeType.SOURCE_REP;
      let children;

      const isSelected = selectedPaths.some(path => {
        return (
          path ===
          (inspectorNode.instancePath
            ? inspectorNode.instancePath + "." + inspectorNode.sourceNodeId
            : inspectorNode.sourceNodeId)
        );
      });
      if (expanded) {
        const childDepth = depth + 1;
        children = inspectorNode.children.map(child => {
          return (
            <EnhancedLayer
              selectedPaths={selectedPaths}
              document={document}
              key={child.id}
              depth={childDepth}
              dispatch={dispatch}
              inspectorNode={child}
              graph={graph}
            />
          );
        });
      }

      let label;

      if (sourceNode.name === PCSourceTagNames.MODULE) {
        const dependency = getPCNodeDependency(
          inspectorNode.sourceNodeId,
          graph
        );
        label = path.basename(dependency.uri);
      } else {
        label = (sourceNode as PCVisibleNode).label;
      }

      return (
        <span>
          <Base
            onClick={onLabelClick}
            variant={cx({
              file: isSourceRep && sourceNode.name === PCSourceTagNames.MODULE,
              component:
                isSourceRep && sourceNode.name === PCSourceTagNames.COMPONENT,
              instance:
                isSourceRep &&
                sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE,
              element:
                isSourceRep && sourceNode.name === PCSourceTagNames.ELEMENT,
              text: isSourceRep && sourceNode.name === PCSourceTagNames.TEXT,
              expanded,
              selected: isSelected,
              alt: inspectorNode.alt,
              content: inspectorNode.name === InspectorTreeNodeType.CONTENT,
              shadow: inspectorNode.name === InspectorTreeNodeType.SHADOW
            })}
            arrowProps={{
              onClick: onArrowButtonClick
            }}
            labelProps={{
              text: label
            }}
            style={{ paddingLeft: depth * 16 }}
          />
          {children}
        </span>
      );
    }
  );

  return (EnhancedLayer = enhance(Base));
};
