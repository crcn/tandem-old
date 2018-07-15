import * as React from "react";
import * as path from "path";
import { FocusComponent } from "../../../../focus";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import {
  SyntheticNode,
  PCSourceTagNames,
  getPCNode,
  DependencyGraph,
  PCVisibleNode,
  getPCNodeDependency,
  SyntheticDocument,
  PCComponent
} from "paperclip";
import {
  InspectorNode,
  InspectorTreeNodeType
} from "../../../../../state/pc-inspector-tree";
import { Dispatch } from "redux";
import {
  sourceInspectorLayerClicked,
  sourceInspectorLayerArrowClicked,
  sourceInspectorLayerLabelChanged
} from "../../../../../actions";

export type LayerControllerOuterProps = {
  depth?: number;
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
  selectedInspectorNodeIds: string[];
  document: SyntheticDocument;
  inspectorNode: InspectorNode;
  syntheticNode: SyntheticNode;
  editingLabel: boolean;
};

type LayerControllerInnerProps = {
  onLabelClick: () => any;
  onLabelDoubleClick: () => any;
  onArrowButtonClick: () => any;
  onLabelInputKeyDown: () => any;
} & LayerControllerOuterProps;

export default Base => {
  let EnhancedLayer;

  const enhance = compose<LayerControllerOuterProps, LayerControllerOuterProps>(
    pure,
    withState("editingLabel", "setEditingLabel", false),
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
      },
      onLabelDoubleClick: ({ inspectorNode, setEditingLabel }) => () => {
        if (inspectorNode.name === InspectorTreeNodeType.SOURCE_REP) {
          setEditingLabel(true);
        }
      },
      onLabelInputKeyDown: ({ dispatch, inspectorNode, setEditingLabel }) => (
        event: React.KeyboardEvent<any>
      ) => {
        if (event.key === "Enter") {
          const label = String((event.target as any).value || "").trim();
          setEditingLabel(false);
          dispatch(
            sourceInspectorLayerLabelChanged(inspectorNode, label, event)
          );
        }
      }
    }),
    Base => ({
      graph,
      depth = 1,
      dispatch,
      document,
      onLabelClick,
      editingLabel,
      selectedInspectorNodeIds,
      inspectorNode,
      onArrowButtonClick,
      onLabelDoubleClick,
      onLabelInputKeyDown
    }: LayerControllerInnerProps) => {
      const expanded = inspectorNode.expanded;
      const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
      const isSourceRep =
        inspectorNode.name === InspectorTreeNodeType.SOURCE_REP;
      let children;

      const isSelected =
        selectedInspectorNodeIds.indexOf(inspectorNode.id) !== -1;
      if (expanded) {
        const childDepth = depth + 1;
        children = inspectorNode.children.map(child => {
          return (
            <EnhancedLayer
              selectedInspectorNodeIds={selectedInspectorNodeIds}
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

      let label = (sourceNode as PCVisibleNode).label;

      if (!label) {
        if (sourceNode.name === PCSourceTagNames.MODULE) {
          const dependency = getPCNodeDependency(
            inspectorNode.sourceNodeId,
            graph
          );
          label = path.basename(dependency.uri);
        } else if (sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE) {
          const component = getPCNode(sourceNode.is, graph);
          label = (component as PCComponent).label;
        } else if (sourceNode.name === PCSourceTagNames.ELEMENT) {
          label = sourceNode.is || "Element";
        }
      }

      return (
        <span>
          <FocusComponent focus={editingLabel}>
            <Base
              onClick={onLabelClick}
              onDoubleClick={onLabelDoubleClick}
              elementProps={{ onKeyDown: onLabelInputKeyDown }}
              variant={cx({
                editingLabel: editingLabel,
                file:
                  isSourceRep && sourceNode.name === PCSourceTagNames.MODULE,
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
          </FocusComponent>
          {children}
        </span>
      );
    }
  );

  return (EnhancedLayer = enhance(Base));
};
