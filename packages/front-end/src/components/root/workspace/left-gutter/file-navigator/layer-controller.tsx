import * as React from "react";
import * as ReactDOM from "react-dom";
import * as path from "path";
import * as cx from "classnames";
import { compose } from "recompose";
import { BaseFileNavigatorLayerProps, NewFileInput, FileNavigatorLayerContainer} from "./view.pc";
import scrollIntoView from "scroll-into-view-if-needed";
import { FSItem, FSItemTagNames, Directory, TreeMoveOffset } from "tandem-common";
import { Dispatch } from "redux";
import {
  fileNavigatorItemClicked,
  fileNavigatorToggleDirectoryClicked,
  fileNavigatorBasenameChanged,
  fileNavigatorDroppedItem,
  fileItemRightClicked
} from "../../../../../actions";
import {
  withFileNavigatorContext,
  FileNavigatorContextProps
} from "./contexts";
import { DragSource, DropTarget } from "react-dnd";
import { FocusComponent } from "../../../../focus";
import { NewFSItemInfo } from "./controller";

export type Props = {
  item: FSItem;
  depth?: number;
  draggingOver: boolean;
} & BaseFileNavigatorLayerProps;

type ContextProps = {
  selected: boolean;
  dispatch: Dispatch<any>;
  newFileInfo: NewFSItemInfo;
  onNewFileChangeComplete: any;
  onNewFileInputChange: any;
  active: boolean;
};

type InnerProps = {
  connectDragSource: any;
  connectDropTarget: any;
  isDragging: boolean;
  canDrop: boolean;
  isOver;
} & Props & ContextProps;

const LAYER_PADDING = 16;

const ROOT_STYLE = {
  display: "inline-block",
  minWidth: "100%"
};

type State = {
  editing: boolean;
};

export default (Base: React.ComponentClass<BaseFileNavigatorLayerProps>) => {
  const FileNavigatorLayer = compose<BaseFileNavigatorLayerProps, Props>(
    withFileNavigatorContext<ContextProps, Props>(
      (
        props,
        {
          selectedFileNodeIds,
          dispatch,
          newFileInfo,
          onNewFileChangeComplete,
          onNewFileInputChange,
          activeEditorUri
        }
      ) => {
        return {
          selected: selectedFileNodeIds.indexOf(props.item.id) !== -1,
          dispatch,
          newFileInfo,
          active: activeEditorUri === props.item.uri,
          onNewFileChangeComplete,
          onNewFileInputChange
        };
      }
    ),
    DragSource("FILE", {
        beginDrag({ item }: Props) {
          return item;
        },
        canDrag() {
          return true;
        }
      },
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
      })
    ),
    DropTarget("FILE", 
    {
      canDrop: ({ item }: ContextProps & Props, monitor) => {
        return item.name === FSItemTagNames.DIRECTORY && monitor.isOver({ shallow: true });
      },
      drop: ({ dispatch, item: directory }, monitor) => {
        const droppedItem = monitor.getItem() as FSItem;
        dispatch(fileNavigatorDroppedItem(droppedItem, directory as Directory, TreeMoveOffset.PREPEND));
      }
    },
    (connect, monitor) => {
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop()
      };
    }),
    (Base: React.ComponentClass<BaseFileNavigatorLayerProps>) => {
      return class FileNavigatorLayerController extends React.PureComponent<
        InnerProps,
        State
      > {
        state = {
          editing: false
        };
        onClick = (event: React.MouseEvent<any>) => {
          this.props.dispatch(fileNavigatorItemClicked(this.props.item));
        };
        onContextMenu = (event: React.MouseEvent<any>) => {
          this.props.dispatch(fileItemRightClicked(this.props.item, event));
        }
        onDoubleClick = () => {
          this.setState({ ...this.state, editing: true });
        };
        onArrowClick = (event: React.MouseEvent<any>) => {
          this.props.dispatch(
            fileNavigatorToggleDirectoryClicked(this.props.item)
          );
          event.stopPropagation();
        };
        onBasenameInputKeyDown = (event: React.KeyboardEvent<any>) => {
          if (event.key === "Enter") {
            this.props.dispatch(
              fileNavigatorBasenameChanged(
                (event.target as HTMLInputElement).value,
                this.props.item
              )
            );
            this.setState({ ...this.state, editing: false });
          }
        };
        componentDidUpdate(prevProps) {
          this.makeVisible(this.props.active && !prevProps.active);
        }
        componentDidMount() {
          this.makeVisible(this.props.active);
        }
        private makeVisible(active: boolean) {
          if (active) {
            const self = ReactDOM.findDOMNode(this) as HTMLSpanElement;
            setTimeout(() => {
              const label = self.children[0].children[0].children[0].children[1].children[0];
              // icky, but we're picking the label here
              scrollIntoView(label, {
                scrollMode: "if-needed"
              });
            }, 10);
          }
        }
        onBasenameInputBlur = (eent: React.KeyboardEvent<any>) => {
          this.setState({ ...this.state, editing: false });
        };
        render() {
          const {
            item,
            depth = 1,
            dispatch,
            selected,
            isDragging,
            isOver,
            connectDragSource,
            connectDropTarget,
            canDrop,
            active,
            newFileInfo,
            onNewFileInputChange,
            onNewFileChangeComplete,
            ...rest
          } = this.props;
          let {draggingOver} = this.props;
          const {
            onClick,
            onContextMenu,
            onArrowClick,
            onBasenameInputKeyDown,
            onBasenameInputBlur,
            onDoubleClick
          } = this;
          const { editing } = this.state;
          const { expanded } = item;

          let children;
          draggingOver = draggingOver || (isOver && canDrop);

          if (expanded) {
            children = item.children.map(child => {
              return (
                <FileNavigatorLayer
                  key={child.id}
                  item={child as FSItem}
                  depth={depth + 1}
                  draggingOver={draggingOver}
                />
              );
            });
          }

          let newFileInput;

          if (newFileInfo && item.uri == newFileInfo.directory.uri) {
            newFileInput = (
              <NewFileInput onChangeComplete={onNewFileChangeComplete} onChange={onNewFileInputChange} />
            );
          }

          const basename = path.basename(item.uri);

          let div = <div style={ROOT_STYLE}>
            <FileNavigatorLayerContainer variant={cx({
              hovering: draggingOver
            })}>
              <FocusComponent focus={editing}>
                {connectDragSource(<div><Base
                  {...rest}
                  style={{
                    paddingLeft: LAYER_PADDING * depth
                  }}
                  onDoubleClick={onDoubleClick}
                  onClick={onClick}
                  onContextMenu={onContextMenu}
                  labelInputProps={
                    {
                      defaultValue: basename,
                      onKeyDown: onBasenameInputKeyDown,
                      onBlur: onBasenameInputBlur
                    } as any
                  }
                  arrowProps={{ onClick: onArrowClick }}
                  variant={cx({
                    active: active && !selected,
                    folder: item.name === FSItemTagNames.DIRECTORY,
                    file: item.name === FSItemTagNames.FILE,
                    alt: item.alt && !draggingOver && !selected,
                    editing,
                    expanded,
                    selected: selected && !draggingOver,
                    blur: Boolean(newFileInfo && newFileInfo.directory)
                  })}
                  label={editing ? "" : basename}
                /></div>)}
              </FocusComponent>
              {newFileInput}
              {children}
            </FileNavigatorLayerContainer>
          </div>;

          if (item.name === FSItemTagNames.DIRECTORY) {
            div = connectDropTarget(div);
          }

          return div;
        }
      };
    }
  )(Base);

  return FileNavigatorLayer;
};
