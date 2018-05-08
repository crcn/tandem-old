

import "./index.scss";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { PaneComponent } from "../../../../pane";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { Directory, File, getAttribute, FileAttributeNames } from "../../../../../../common";
import { fileNavigatorItemClicked, fileNavigatorItemDoubleClicked, newFileEntered, newDirectoryEntered } from "../../../../../actions";

/*

TODO:

- [ ] create new file
- [ ] add new folder
*/



type FileNavigatorHeaderComponentOuterProps = {
  onAddFileButtonClick: () => any;
  onAddDirectoryButtonClick: () => any;
}

const BaseFileNavigatorHeaderComponent = ({onAddFileButtonClick, onAddDirectoryButtonClick}: FileNavigatorHeaderComponentOuterProps) => <div className="header">
  Files <span className="controls">
    {/* <span onClick={onAddFileButtonClick}>nf</span>
    <span onClick={onAddDirectoryButtonClick}>nd</span> */}
  </span>
</div>;


type FileComponentOuterProps = {
  file: File|Directory;
  dispatch: Dispatch<any>;
  depth: number;
};

type FileComponentInnerProps = {
  onLabelClick: (event: React.MouseEvent<any>) => any;
  onLabelDoubleClick: (event: React.MouseEvent<any>) => any;
} & FileComponentOuterProps;

const PADDING = 8;

const BaseFileComponent = ({ file, depth, dispatch, onLabelClick, onLabelDoubleClick }: FileComponentInnerProps) => {
  const isDirectory = file.name === "directory";
  const expanded = getAttribute(file, "expanded");
  const selected = getAttribute(file, "selected");
  const labelStyle = {
    paddingLeft: depth * PADDING
  };

  return <div className={cx("file", { selected })}>
    <div className="label" style={labelStyle} onClick={onLabelClick} onDoubleClick={onLabelDoubleClick}>
      { isDirectory ? expanded ? <i className="ion-arrow-down-b" /> : <i className="ion-arrow-right-b" /> : <i className="ion-android-document" />}
      { getAttribute(file, "basename") }
    </div>
    { expanded ? <div className="children">
      {
        file.children.map(child => {
          return <FileComponent key={child.id} file={child as File} depth={depth + 1} dispatch={dispatch} />
        })
      }
    </div> : null }
  </div>;
}

const FileComponent = compose<FileComponentInnerProps, FileComponentOuterProps>(
  pure,
  withHandlers({
    onLabelClick: ({ dispatch, file }) => (event) => {
      dispatch(fileNavigatorItemClicked(getAttribute(file, FileAttributeNames.URI)));
    },
    onLabelDoubleClick: ({ dispatch, file }) => (event) => {
      dispatch(fileNavigatorItemDoubleClicked(getAttribute(file, FileAttributeNames.URI)));
    }
  })
)(BaseFileComponent);

type FileNavigatorPaneOuterProps = {
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
};

type FileNavigatorPaneInnerProps = {
  onAddDirectoryButtonClick: () => any;
  onAddFileButtonClick: () => any;
} & FileNavigatorPaneOuterProps

const FileNavigatorHeaderComponent = BaseFileNavigatorHeaderComponent;

const BaseFileNavigatorPaneComponent = ({rootDirectory, dispatch, onAddDirectoryButtonClick, onAddFileButtonClick}: FileNavigatorPaneInnerProps) => {
  if (!rootDirectory) {
    return null;
  }
  return <PaneComponent header={<FileNavigatorHeaderComponent onAddDirectoryButtonClick={onAddDirectoryButtonClick} onAddFileButtonClick={onAddFileButtonClick} />} className="m-file-navigator-pane">
      {rootDirectory.children.map(file => {
        return <FileComponent key={file.id} file={file as File} depth={1} dispatch={dispatch} />
      })}
  </PaneComponent>;
}

export const FileNavigatorPaneComponent = compose<FileNavigatorPaneInnerProps, FileNavigatorPaneOuterProps>(
  pure,
  withHandlers({
    onAddDirectoryButtonClick: ({ dispatch }) => () => {
      dispatch(newDirectoryEntered(prompt("New folder name")));
    },
    onAddFileButtonClick: ({ dispatch }) => () => {
      dispatch(newFileEntered(prompt("New file name")));
    }
  })
)(BaseFileNavigatorPaneComponent);

