import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { identity } from "lodash";
import { compose, pure, withHandlers, withState, withProps } from "recompose";
import {
  EMPTY_ARRAY,
  getNestedTreeNodeById,
  TreeNode,
  TreeMoveOffset
} from "tandem-common";
import { Dispatch } from "redux";
import { DropTarget, DragSource, DropTargetCollector } from "react-dnd";
import { FocusComponent } from "../focus";

export type TreeLayerDroppedNodeActionCreator = (
  child: TreeNode<any>,
  targetNode: TreeNode<any>,
  offset: TreeMoveOffset
) => any;
export type TreeLayerMouseActionCreator = (
  node: TreeNode<any>,
  sourceEvent?: React.MouseEvent<any>
) => any;
export type TreeLayerLabelChangedActionCreator = (
  label: string,
  node: TreeNode<any>
) => any;

type AttributeInfo = (node: TreeNode<string>) => any;

export type TreeNodeLayerOuterProps = {
  root?: TreeNode<any>;
  node: TreeNode<any>;
  depth: number;
  dispatch: Dispatch<any>;
  hoveringNodeIds: string[];
  selectedNodeIds: string[];
};

type TreeNodeLayerLabelOuterProps = {
  root: TreeNode<any>;
  node: TreeNode<any>;
  depth: number;
  selected: boolean;
  hovering: boolean;
  expanded: boolean;
  editingLabel: boolean;
  dispatch: Dispatch<any>;
};

type TreeNodeLayerLabelInnerProps = {
  connectDropTarget?: any;
  connectDragSource?: any;
  isOver: boolean;
  canDrop: boolean;
  onLabelMouseOver: (event: React.MouseEvent<any>) => any;
  onLabelMouseOut: (event: React.MouseEvent<any>) => any;
  onLabelClick: (event: React.MouseEvent<any>) => any;
  onLabelDoubleClick: (event: React.MouseEvent<any>) => any;
  onExpandToggleButtonClick: (event: React.MouseEvent<any>) => any;
  onLabelKeyDown: (event: React.KeyboardEvent<any>) => any;
  onLabelBlur: () => any;
} & TreeNodeLayerLabelOuterProps;

type TreeLayerOptions = {
  actionCreators: {
    treeLayerDroppedNode?: TreeLayerDroppedNodeActionCreator;
    treeLayerMouseOut?: TreeLayerMouseActionCreator;
    treeLayerMouseOver?: TreeLayerMouseActionCreator;
    treeLayerClick?: TreeLayerMouseActionCreator;
    treeLayerDoubleClick?: TreeLayerMouseActionCreator;
    treeLayerLabelChanged?: TreeLayerLabelChangedActionCreator;
    treeLayerExpandToggleClick?: TreeLayerMouseActionCreator;
    treeLayerEditLabelBlur?: TreeLayerMouseActionCreator;
  };
  canDrop?: (
    child: TreeNode<any>,
    props: TreeNodeLayerOuterProps,
    offset: number
  ) => boolean;
  canDrag?: (props: TreeNodeLayerLabelOuterProps) => boolean;
  layersEditable?: boolean;
  reorganizable?: boolean;
  dragType: string;
  depthOffset?: number;
  attributeOptions?: {
    nodeLabelAttr?: AttributeInfo;
    expandAttr?: AttributeInfo;
    editingLabelAttr?: AttributeInfo;
  };
  hasChildren?: (node: TreeNode<any>) => boolean;
  getLabelProps?: (attributes: any, props: TreeNodeLayerLabelOuterProps) => any;
  childRenderer?: (Base: any) => (props: TreeNodeLayerOuterProps) => any[];
  layerRenderer?: (Base: any) => (props: TreeNodeLayerOuterProps) => any;
};

const DEFAULT_NODE_EXPAND_ATTRIBUTE = node => node.expanded;
const DEFAULT_NODE_LABEL_ATTRIBUTE = node => node.label;
const DEFAULT_NODE_EDITING_LABEL_ATTRIBUTE = node => node.editingLabel;

export const defaultChildRender = Base => ({
  node,
  hoveringNodeIds,
  selectedNodeIds,
  depth,
  dispatch,
  ...rest
}: TreeNodeLayerOuterProps) =>
  node.children.map(child => {
    return (
      <Base
        hoveringNodeIds={hoveringNodeIds}
        selectedNodeIds={selectedNodeIds}
        key={child.id}
        node={child as TreeNode<any>}
        depth={depth + 1}
        dispatch={dispatch}
        {...rest}
      />
    );
  });

const defaultLayerRenderer = Base => props => React.createElement(Base, props);

const defaultShowChildren = (node: TreeNode<any>) => node.children.length;

export const createTreeLayerComponents = <
  TTreeLayerOuterProps extends TreeNodeLayerOuterProps
>({
  attributeOptions: {
    nodeLabelAttr = DEFAULT_NODE_LABEL_ATTRIBUTE,
    expandAttr = DEFAULT_NODE_EXPAND_ATTRIBUTE,
    editingLabelAttr = DEFAULT_NODE_EDITING_LABEL_ATTRIBUTE
  } = {},
  childRenderer = defaultChildRender,
  hasChildren = defaultShowChildren,
  layerRenderer = defaultLayerRenderer,
  canDrop = () => true,
  canDrag = () => true,
  getLabelProps = identity,
  depthOffset = 30,
  actionCreators: {
    treeLayerDroppedNode,
    treeLayerMouseOver,
    treeLayerEditLabelBlur,
    treeLayerLabelChanged,
    treeLayerClick,
    treeLayerDoubleClick,
    treeLayerMouseOut,
    treeLayerExpandToggleClick
  },
  dragType,
  reorganizable = true
}: TreeLayerOptions) => {
  const DRAG_TYPE = dragType;
  const DEPTH_PADDING = 8;
  const DEPTH_OFFSET = depthOffset;
  let renderChildren;

  type InsertOuterProps = {
    root: TreeNode<any>;
    depth: number;
    node: TreeNode<any>;
    dispatch: Dispatch<any>;
  };

  type InsertInnerProps = {
    canDrop: boolean;
    isOver: boolean;
    connectDropTarget: any;
  } & InsertOuterProps;

  const BaseInsertComponent = ({
    depth,
    isOver,
    canDrop,
    connectDropTarget
  }: InsertInnerProps) => {
    const style = {
      width: `calc(100% - ${DEPTH_OFFSET + depth * DEPTH_PADDING}px)`
    };
    return connectDropTarget(
      <div
        style={style}
        className={cx("insert-line", { hovering: isOver && canDrop })}
      />
    );
  };

  const withNodeDropTarget = (offset: TreeMoveOffset) =>
    DropTarget(
      DRAG_TYPE,
      {
        canDrop: (props: TreeNodeLayerOuterProps, monitor) => {
          const draggingNode = monitor.getItem() as TreeNode<any>;
          return (
            props.node.id !== draggingNode.id &&
            getNestedTreeNodeById(props.node.id, draggingNode) == null &&
            canDrop(draggingNode, props, offset)
          );
        },
        drop: ({ dispatch, node }, monitor) => {
          dispatch(
            treeLayerDroppedNode(
              monitor.getItem() as TreeNode<any>,
              node,
              offset
            )
          );
        }
      },
      (connect, monitor) => {
        return {
          connectDropTarget: connect.dropTarget(),
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop()
        };
      }
    );

  const InsertBeforeComponent = compose<InsertInnerProps, InsertOuterProps>(
    pure,
    withNodeDropTarget(TreeMoveOffset.BEFORE)
  )(BaseInsertComponent);

  const InsertAfterComponent = compose<InsertInnerProps, InsertOuterProps>(
    pure,
    withNodeDropTarget(TreeMoveOffset.AFTER)
  )(BaseInsertComponent);

  const BaseTreeNodeLayerLabelComponent = (
    props: TreeNodeLayerLabelInnerProps
  ) => {
    const {
      connectDropTarget,
      connectDragSource,
      node,
      canDrop,
      isOver,
      depth,
      editingLabel,
      expanded,
      selected,
      hovering,
      onLabelClick,
      onLabelMouseOut,
      onLabelMouseOver,
      onLabelDoubleClick,
      onLabelKeyDown,
      onLabelBlur,
      onExpandToggleButtonClick
    } = props;
    const labelProps = getLabelProps(
      {
        style: {
          paddingLeft: DEPTH_OFFSET + depth * DEPTH_PADDING
        },
        className: cx(
          "label",
          { selected, hovering: hovering || (isOver && canDrop) },
          props
        )
      },
      props
    );
    const label = nodeLabelAttr(node);

    return connectDropTarget(
      connectDragSource(
        <div
          {...labelProps}
          onMouseOver={onLabelMouseOver}
          onMouseOut={onLabelMouseOut}
          onClick={onLabelClick}
          onDoubleClick={onLabelDoubleClick}
        >
          {editingLabel ? (
            <FocusComponent>
              <input
                onKeyDown={onLabelKeyDown}
                onBlur={onLabelBlur}
                defaultValue={label}
              />
            </FocusComponent>
          ) : (
            <span>
              <span onClick={onExpandToggleButtonClick}>
                {hasChildren(node) ? (
                  expanded ? (
                    <i className="ion-arrow-down-b" />
                  ) : (
                    <i className="ion-arrow-right-b" />
                  )
                ) : null}
              </span>
              {label || "Untitled"}
            </span>
          )}
        </div>
      )
    );
  };

  const TreeNodeLayerLabelComponent = compose<
    TreeNodeLayerLabelInnerProps,
    TreeNodeLayerLabelOuterProps
  >(
    pure,
    withHandlers({
      onLabelMouseOver: ({ dispatch, document, node }) => () => {
        treeLayerMouseOver && dispatch(treeLayerMouseOver(node));
      },
      onLabelMouseOut: ({ dispatch, document, node }) => () => {
        treeLayerMouseOut && dispatch(treeLayerMouseOut(node));
      },
      onLabelClick: ({ dispatch, document, node }) => event => {
        treeLayerClick && dispatch(treeLayerClick(node, event));
      },
      onLabelDoubleClick: ({ dispatch, document, node }) => () => {
        treeLayerDoubleClick && dispatch(treeLayerDoubleClick(node));
      },
      onExpandToggleButtonClick: ({ dispatch, document, node }) => (
        event: React.MouseEvent<any>
      ) => {
        treeLayerExpandToggleClick &&
          dispatch(treeLayerExpandToggleClick(node));
        event.stopPropagation();
      },
      onLabelKeyDown: ({ dispatch, node }) => (event: KeyboardEvent) => {
        if (event.key === "Enter" && treeLayerLabelChanged) {
          dispatch(treeLayerLabelChanged((event.target as any).value, node));
        }
      },
      onLabelBlur: ({ dispatch, node }) => event => {
        treeLayerEditLabelBlur && dispatch(treeLayerEditLabelBlur(node));
      }
    }),
    DragSource(
      DRAG_TYPE,
      {
        beginDrag({ node }: TreeNodeLayerLabelOuterProps) {
          return node;
        },
        canDrag(props) {
          return canDrag(props);
        }
      },
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
      })
    ),
    withNodeDropTarget(TreeMoveOffset.PREPEND)
  )(BaseTreeNodeLayerLabelComponent);

  type TreeNodeLayerInnerProps = {} & TTreeLayerOuterProps & any;

  const BaseTreeNodeLayerComponent = ({
    hoveringNodeIds,
    selectedNodeIds,
    node,
    depth,
    dispatch,
    root,
    ...rest
  }: TreeNodeLayerInnerProps) => {
    const selected = selectedNodeIds.indexOf(node.id) !== -1;
    const hovering = hoveringNodeIds.indexOf(node.id) !== -1;
    const expanded = expandAttr(node);
    const editingLabel = editingLabelAttr(node);
    if (!root) {
      root = node;
    }

    return (
      <div className="m-tree-node-layer">
        {!reorganizable ? null : (
          <InsertBeforeComponent
            node={node}
            depth={depth}
            root={root}
            dispatch={dispatch}
          />
        )}
        <TreeNodeLayerLabelComponent
          root={root}
          editingLabel={editingLabel}
          node={node}
          selected={selected}
          hovering={hovering}
          dispatch={dispatch}
          depth={depth}
          expanded={expanded}
          {...rest}
        />
        <div className="children">
          {!node.children.length || expanded
            ? renderChildren({
                hoveringNodeIds,
                selectedNodeIds,
                node,
                depth,
                dispatch,
                root: root || node,
                ...rest
              })
            : null}
        </div>
        {!reorganizable ? null : (
          <InsertAfterComponent
            node={node}
            root={root}
            depth={depth}
            dispatch={dispatch}
          />
        )}
      </div>
    );
  };

  const TreeNodeLayerComponent = compose<
    TreeNodeLayerInnerProps,
    TTreeLayerOuterProps
  >(
    pure,
    layerRenderer
  )(BaseTreeNodeLayerComponent);

  renderChildren = childRenderer(TreeNodeLayerComponent);

  const RootNodeLayerComponent = compose<
    TreeNodeLayerInnerProps,
    TTreeLayerOuterProps
  >(pure)(BaseTreeNodeLayerComponent);

  return { RootNodeLayerComponent, TreeNodeLayerComponent };
};
