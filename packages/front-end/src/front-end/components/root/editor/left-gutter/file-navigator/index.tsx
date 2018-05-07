

import "./index.scss";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { PaneComponent } from "../../../../pane";
import { Dispatch } from "redux";
import { Directory, File, getAttribute } from "../../../../../../common";
import { fileNavigatorItemClicked, fileNavigatorItemDoubleClicked } from "../../../../../actions";

/*

TODO:

- [ ] create new file
- [ ] add new folder
*/

const BaseFileNavigatorHeaderComponent = () => <div className="header">
  Files
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
  const labelStyle = {
    paddingLeft: depth * PADDING
  };

  return <div className="file">
    <div className="label" style={labelStyle} onClick={onLabelClick} onDoubleClick={onLabelDoubleClick}>
      { isDirectory ? expanded ? <i className="ion-arrow-down-b" /> : <i className="ion-arrow-right-b" /> : <i className="ion-android-document" />}
      { getAttribute(file, "basename") }
    </div>
    { expanded ? <div className="children">
      {
        file.children.map(child => {
          return <FileComponent file={child as File} depth={depth + 1} dispatch={dispatch} />
        })
      }
    </div> : null }
  </div>;
}

const FileComponent = compose<FileComponentInnerProps, FileComponentOuterProps>(
  pure,
  withHandlers({
    onLabelClick: ({ dispatch, file }) => (event) => {
      dispatch(fileNavigatorItemClicked(file.id));
    },
    onLabelDoubleClick: ({ dispatch, file }) => (event) => {
      dispatch(fileNavigatorItemDoubleClicked(file.id));
    }
  })
)(BaseFileComponent);

type FileNavigatorPaneOuterProps = {
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
};

type FileNavigatorPaneInnerProps = {
  onLabelClick: (file: File, vent: React.MouseEvent<any>) => any;
} & FileNavigatorPaneOuterProps

const FileNavigatorHeaderComponent = BaseFileNavigatorHeaderComponent;

const BaseFileNavigatorPaneComponent = ({rootDirectory, dispatch}: FileNavigatorPaneOuterProps) => {
  if (!rootDirectory) {
    return null;
  }
  return <PaneComponent header={<FileNavigatorHeaderComponent />} className="m-file-navigator-pane">
      {rootDirectory.children.map(file => {
        return <FileComponent file={file as File} depth={1} dispatch={dispatch} />
      })}
  </PaneComponent>;
}

export const FileNavigatorPaneComponent = compose<FileNavigatorPaneInnerProps, FileNavigatorPaneOuterProps>(
  pure,
)(BaseFileNavigatorPaneComponent);

