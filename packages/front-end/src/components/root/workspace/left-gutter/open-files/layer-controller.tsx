import * as React from "react";
import * as path from "path";
import { FocusComponent } from "../../../../focus";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import { DropTarget, DragSource } from "react-dnd";
import {
  SyntheticNode,
  PCSourceTagNames,
  getPCNode,
  DependencyGraph,
  PCVisibleNode,
  getPCNodeDependency,
  SyntheticDocument,
  PCComponent,
  getPCNodeContentNode,
  PCModule
} from "paperclip";
import {
  InspectorNode,
  InspectorTreeNodeType,
  getInspectorSyntheticNode
} from "../../../../../state/pc-inspector-tree";
import { Dispatch } from "redux";
import {
  sourceInspectorLayerClicked,
  sourceInspectorLayerArrowClicked,
  sourceInspectorLayerLabelChanged
} from "../../../../../actions";
import {
  containsNestedTreeNodeById,
  TreeMoveOffset
} from "../../../../../../node_modules/tandem-common";

export type LayerControllerOuterProps = {
  depth?: number;
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
  contentNode: InspectorNode;
  selectedInspectorNodeIds: string[];
  document: SyntheticDocument;
  inspectorNode: InspectorNode;
  syntheticNode: SyntheticNode;
  editingLabel: boolean;
};

type LayerControllerInnerProps = {
  onLabelClick: () => any;
  connectDragSource?: any;
  connectDropTarget?: any;
  onLabelDoubleClick: () => any;
  onArrowButtonClick: () => any;
  onLabelInputKeyDown: () => any;
} & LayerControllerOuterProps;

const DRAG_TYPE = "INSPECTOR_NODE";

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
    DropTarget(
      DRAG_TYPE,
      {
        canDrop: (
          { inspectorNode, contentNode, graph }: LayerControllerOuterProps,
          monitor
        ) => {
          contentNode = getContentNode(inspectorNode, contentNode, graph);
          const draggingNode = monitor.getItem() as InspectorNode;
          const contentSourceNode =
            contentNode && getPCNode(contentNode.sourceNodeId, graph);

          const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
          return (
            !contentSourceNode ||
            containsNestedTreeNodeById(sourceNode.id, contentSourceNode)
          );
        },
        drop: ({ dispatch, inspectorNode }, monitor) => {
          // dispatch(
          //   treeLayerDroppedNode(
          //     monitor.getItem() as TreeNode<any>,
          //     node,
          //     offset
          //   )
          // );
        }
      },
      (connect, monitor) => {
        return {
          connectDropTarget: connect.dropTarget(),
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop()
        };
      }
    ),
    DragSource(
      DRAG_TYPE,
      {
        beginDrag({ inspectorNode }: LayerControllerOuterProps) {
          return inspectorNode;
        },
        canDrag({
          inspectorNode,
          contentNode,
          graph
        }: LayerControllerOuterProps) {
          contentNode = getContentNode(inspectorNode, contentNode, graph);

          const contentSourceNode =
            contentNode && getPCNode(contentNode.sourceNodeId, graph);
          const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph);
          return (
            contentSourceNode &&
            containsNestedTreeNodeById(sourceNode.id, contentSourceNode)
          );
        }
      },
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
      })
    ),
    Base => ({
      graph,
      depth = 1,
      dispatch,
      document,
      onLabelClick,
      editingLabel,
      selectedInspectorNodeIds,
      contentNode,
      inspectorNode,
      onArrowButtonClick,
      onLabelDoubleClick,
      onLabelInputKeyDown,
      connectDragSource,
      connectDropTarget
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
              contentNode={getContentNode(inspectorNode, contentNode, graph)}
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
            {connectDropTarget(
              connectDragSource(
                <div>
                  <Base
                    onClick={onLabelClick}
                    onDoubleClick={onLabelDoubleClick}
                    labelInputProps={{ onKeyDown: onLabelInputKeyDown }}
                    variant={cx({
                      editingLabel: editingLabel,
                      file:
                        isSourceRep &&
                        sourceNode.name === PCSourceTagNames.MODULE,
                      component:
                        isSourceRep &&
                        sourceNode.name === PCSourceTagNames.COMPONENT,
                      instance:
                        isSourceRep &&
                        sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE,
                      element:
                        isSourceRep &&
                        sourceNode.name === PCSourceTagNames.ELEMENT,
                      text:
                        isSourceRep &&
                        sourceNode.name === PCSourceTagNames.TEXT,
                      expanded,
                      selected: isSelected,
                      alt: inspectorNode.alt && !isSelected,
                      content:
                        inspectorNode.name === InspectorTreeNodeType.CONTENT,
                      shadow:
                        inspectorNode.name === InspectorTreeNodeType.SHADOW
                    })}
                    arrowProps={{
                      onClick: onArrowButtonClick
                    }}
                    labelProps={{
                      text: label
                    }}
                    style={{ paddingLeft: depth * 16 }}
                  />
                </div>
              )
            )}
          </FocusComponent>
          {children}
        </span>
      );
    }
  );

  return (EnhancedLayer = enhance(Base));
};

const getContentNode = (
  inspectorNode: InspectorNode,
  contentNode: InspectorNode,
  graph: DependencyGraph
) => {
  return (
    contentNode ||
    (getPCNode(inspectorNode.sourceNodeId, graph).name !==
    PCSourceTagNames.MODULE
      ? inspectorNode
      : null)
  );
};
