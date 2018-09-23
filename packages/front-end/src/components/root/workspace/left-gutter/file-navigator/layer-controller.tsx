import * as React from "react";
import * as path from "path";
import * as cx from "classnames";
import { compose } from "recompose";
import { BaseFileNavigatorLayerProps, NewFileInput, FileNavigatorLayerContainer} from "./view.pc";
import { FSItem, FSItemTagNames, Directory, TreeMoveOffset } from "tandem-common";
import { Dispatch } from "redux";
import {
  fileNavigatorItemClicked,
  fileNavigatorToggleDirectoryClicked,
  fileNavigatorBasenameChanged,
  fileNavigatorDroppedItem
} from "../../../../../actions";
import {
  withFileNavigatorContext,
  FileNavigatorContextProps
} from "./contexts";
import { DragSource, DropTarget } from "react-dnd";
import { FocusComponent } from "../../../../focus";

export type Props = {
  item: FSItem;
  depth?: number;
  draggingOver: boolean;
} & BaseFileNavigatorLayerProps;

type ContextProps = {
  selected: boolean;
  dispatch: Dispatch<any>;
  addingFSItemDirectory: Directory;
  onNewFileChangeComplete: any;
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
          addingFSItemDirectory,
          onNewFileChangeComplete
        }
      ) => {
        return {
          selected: selectedFileNodeIds.indexOf(props.item.id) !== -1,
          dispatch,
          addingFSItemDirectory,
          onNewFileChangeComplete
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
        console.log("DROp");
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
        onClick = () => {
          this.props.dispatch(fileNavigatorItemClicked(this.props.item));
        };
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
            addingFSItemDirectory,
            onNewFileChangeComplete,
            ...rest
          } = this.props;
          let {draggingOver} = this.props;
          const {
            onClick,
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

          if (addingFSItemDirectory && item.uri == addingFSItemDirectory.uri) {
            newFileInput = (
              <NewFileInput onChangeComplete={onNewFileChangeComplete} />
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
                  labelInputProps={
                    {
                      defaultValue: basename,
                      onKeyDown: onBasenameInputKeyDown,
                      onBlur: onBasenameInputBlur
                    } as any
                  }
                  arrowProps={{ onClick: onArrowClick }}
                  variant={cx({
                    folder: item.name === FSItemTagNames.DIRECTORY,
                    file: item.name === FSItemTagNames.FILE,
                    alt: item.alt && !draggingOver && !selected,
                    editing,
                    expanded,
                    selected: selected && !draggingOver,
                    blur: !!addingFSItemDirectory
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
