import * as React from "react";
import * as path from "path";
import * as cx from "classnames";
import { compose } from "recompose";
import { BaseFileNavigatorLayerProps, NewFileInput } from "./view.pc";
import { FSItem, FSItemTagNames, Directory } from "tandem-common";
import { Dispatch } from "redux";
import {
  fileNavigatorItemClicked,
  fileNavigatorToggleDirectoryClicked,
  fileNavigatorBasenameChanged
} from "../../../../../actions";
import {
  withFileNavigatorContext,
  FileNavigatorContextProps
} from "./contexts";
import { FocusComponent } from "../../../../focus";

export type Props = {
  item: FSItem;
  depth?: number;
} & BaseFileNavigatorLayerProps;

type ContextProps = {
  selected: boolean;
  dispatch: Dispatch<any>;
  addingFSItemDirectory: Directory;
  onNewFileChangeComplete: any;
};

type InnerProps = Props & ContextProps;

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
            addingFSItemDirectory,
            onNewFileChangeComplete,
            ...rest
          } = this.props;
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

          if (expanded) {
            children = item.children.map(child => {
              return (
                <FileNavigatorLayer
                  key={child.id}
                  item={child as FSItem}
                  depth={depth + 1}
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

          return (
            <span style={ROOT_STYLE}>
              <FocusComponent focus={editing}>
                <Base
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
                    editing,
                    expanded,
                    selected,
                    blur: !!addingFSItemDirectory
                  })}
                  label={editing ? "" : basename}
                />
              </FocusComponent>
              {newFileInput}
              {children}
            </span>
          );
        }
      };
    }
  )(Base);

  return FileNavigatorLayer;
};
