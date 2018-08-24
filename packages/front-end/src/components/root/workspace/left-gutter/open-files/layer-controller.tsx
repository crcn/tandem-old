import * as React from "react";
import * as path from "path";
import { FocusComponent } from "../../../../focus";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import { DragSource } from "react-dnd";
import { withNodeDropTarget } from "./dnd-controller";
import { BeforeDropZone, AfterDropZone } from "./drop-zones.pc";
import {
  SyntheticNode,
  PCSourceTagNames,
  getPCNode,
  DependencyGraph,
  PCVisibleNode,
  getPCNodeDependency,
  SyntheticDocument,
  PCComponent,
  PCNode
} from "paperclip";
import {
  InspectorNode,
  InspectorTreeNodeName
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
import { BaseNodeLayerProps } from "./layer.pc";
import { withLayersPaneContext, LayersPaneContextProps } from "./contexts";

export type Props = {
  depth?: number;
  inShadow?: boolean;
  inspectorNode: InspectorNode;
};

type ContextProps = {
  canDrag: boolean;
  assocSourceNode: PCNode;
  isSelected: boolean;
  isHovering: boolean;
  dispatch: Dispatch<any>;
  label: string;
};

type InnerProps = {
  editingLabel: boolean;
  isOver: boolean;
  canDrop: boolean;
  onLabelClick: () => any;
  connectDragSource?: any;
  connectDropTarget?: any;
  onLabelDoubleClick: () => any;
  onArrowButtonClick: () => any;
  onLabelInputKeyDown: () => any;
} & ContextProps &
  Props;

const DRAG_TYPE = "INSPECTOR_NODE";

const LAYER_PADDING = 16;

export default (Base: React.ComponentClass<BaseNodeLayerProps>) => {
  let EnhancedLayer: React.ComponentClass<Props>;

  const enhance = compose<BaseNodeLayerProps, Props>(
    withLayersPaneContext<ContextProps, Props>(
      (
        { inspectorNode }: Props,
        {
          graph,
          rootSourceNodeInspector,
          selectedInspectorNodeIds,
          hoveringInspectorNodeIds,
          dispatch,
          document
        }: LayersPaneContextProps
      ) => {
        const contentSourceNode =
          rootSourceNodeInspector &&
          getPCNode(rootSourceNodeInspector.assocSourceNodeId, graph);
        const sourceNode = getPCNode(inspectorNode.assocSourceNodeId, graph);
        const canDrag =
          contentSourceNode &&
          containsNestedTreeNodeById(sourceNode.id, contentSourceNode);

        const assocSourceNode = getPCNode(
          inspectorNode.assocSourceNodeId,
          graph
        );

        let label = (assocSourceNode as PCVisibleNode).label;

        if (!label) {
          if (assocSourceNode.name === PCSourceTagNames.MODULE) {
            const dependency = getPCNodeDependency(
              inspectorNode.assocSourceNodeId,
              graph
            );
            label = path.basename(dependency.uri);
          } else if (
            assocSourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE
          ) {
            const component = getPCNode(assocSourceNode.is, graph);
            label = (component as PCComponent).label;
          } else if (assocSourceNode.name === PCSourceTagNames.ELEMENT) {
            label = assocSourceNode.is || "Element";
          }
          if (assocSourceNode.name === PCSourceTagNames.SLOT) {
            label = assocSourceNode.label;
          }
        }

        return {
          dispatch,
          isSelected: selectedInspectorNodeIds.indexOf(inspectorNode.id) !== -1,
          isHovering: hoveringInspectorNodeIds.indexOf(inspectorNode.id) !== -1,
          assocSourceNode,
          canDrag,
          label
        };
      }
    ),
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
        if (inspectorNode.name === InspectorTreeNodeName.SOURCE_REP) {
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
    withNodeDropTarget(TreeMoveOffset.PREPEND),
    DragSource(
      DRAG_TYPE,
      {
        beginDrag({ inspectorNode }: InnerProps) {
          return inspectorNode;
        },
        canDrag({ inspectorNode, assocSourceNode, canDrag }: InnerProps) {
          return canDrag;
        }
      },
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
      })
    ),
    (Base: React.ComponentClass<BaseNodeLayerProps>) => ({
      depth = 1,
      dispatch,
      onLabelClick,
      editingLabel,
      isSelected,
      isHovering,
      isOver,
      canDrop,
      inspectorNode,
      onArrowButtonClick,
      onLabelDoubleClick,
      onLabelInputKeyDown,
      assocSourceNode,
      connectDragSource,
      label,
      connectDropTarget,
      inShadow
    }: InnerProps) => {
      const expanded = inspectorNode.expanded;
      const isSourceRep =
        inspectorNode.name === InspectorTreeNodeName.SOURCE_REP;
      inShadow =
        inShadow || inspectorNode.name === InspectorTreeNodeName.SHADOW;
      let children;

      isHovering = isHovering || (canDrop && isOver);

      if (expanded) {
        const childDepth = depth + 1;
        children = inspectorNode.children.map((child, i) => {
          return (
            <EnhancedLayer
              inShadow={inShadow}
              key={child.id + i}
              depth={childDepth}
              inspectorNode={child}
            />
          );
        });
      }

      const dropZoneStyle = {
        width: `calc(100% - ${depth * LAYER_PADDING}px)`
      };

      return (
        <span>
          <BeforeDropZone
            style={dropZoneStyle}
            dispatch={dispatch}
            inspectorNode={inspectorNode}
          />
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
                        assocSourceNode.name === PCSourceTagNames.MODULE,
                      component:
                        isSourceRep &&
                        assocSourceNode.name === PCSourceTagNames.COMPONENT,
                      instance:
                        isSourceRep &&
                        assocSourceNode.name ===
                          PCSourceTagNames.COMPONENT_INSTANCE,
                      element:
                        isSourceRep &&
                        assocSourceNode.name === PCSourceTagNames.ELEMENT,
                      text:
                        isSourceRep &&
                        assocSourceNode.name === PCSourceTagNames.TEXT,
                      expanded,
                      selected: isSelected,
                      slot:
                        inspectorNode.name ===
                          InspectorTreeNodeName.SOURCE_REP &&
                        assocSourceNode.name === PCSourceTagNames.SLOT,
                      plug:
                        inspectorNode.name === InspectorTreeNodeName.CONTENT,
                      alt: inspectorNode.alt && !isSelected,
                      content:
                        inspectorNode.name === InspectorTreeNodeName.CONTENT,
                      shadow:
                        inspectorNode.name === InspectorTreeNodeName.SHADOW,
                      hover: isHovering,
                      inShadow: !isSelected && inShadow
                    })}
                    arrowProps={{
                      onClick: onArrowButtonClick
                    }}
                    labelProps={{
                      text: label
                    }}
                    style={{ paddingLeft: depth * LAYER_PADDING }}
                  />
                </div>
              )
            )}
          </FocusComponent>
          <AfterDropZone
            style={dropZoneStyle}
            dispatch={dispatch}
            inspectorNode={inspectorNode}
          />
          {children}
        </span>
      );
    }
  );

  return (EnhancedLayer = enhance(Base));
};
