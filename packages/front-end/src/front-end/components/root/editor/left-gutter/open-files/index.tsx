/*

TODOS:

- [ ] display expressions within each open file

*/

import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { OpenFile } from "../../../../../state";
import { compose, pure, withHandlers } from "recompose";
import { PaneComponent } from "../../../../pane";
import * as cx from "classnames";
import * as path from "path";
import { openFilesItemClick, openFilesItemCloseClick } from "../../../../../actions";


type OpenFileOuterProps = {
  openFile: OpenFile;
  active: boolean;
  dispatch: Dispatch<any>;
}

type OpenFileInnerProps = {
  onClick: () => any;
  onCloseClick: () => any;
} & OpenFileOuterProps;

const BaseOpenFileComponent = ({ openFile: { temporary, uri, newContent }, active, onClick, onCloseClick }: OpenFileInnerProps) => {
  return <div className={cx("open-file", { temporary, active, unsaved: !!newContent })} onClick={onClick}>
    <i className="ion-close" onClick={onCloseClick}>
    </i>
    { newContent ? <i className="ion-record" onClick={onCloseClick}>
    </i> : null }
    <div className="basename">
      {path.basename(uri)}
    </div>
    <div className="uri">
      {uri}
    </div>
  </div>
}

const OpenFileComponent = compose<OpenFileInnerProps, OpenFileOuterProps>(
  pure,
  withHandlers({
    onClick: ({ dispatch, openFile }) => () => {
      dispatch(openFilesItemClick(openFile.uri));
    },
    onCloseClick: ({ dispatch, openFile }) => (event: React.MouseEvent<any>) => {
      event.stopPropagation();
      dispatch(openFilesItemCloseClick(openFile.uri));
    }
  })
)(BaseOpenFileComponent);

type OpenFilesPaneOuterProps = {
  openFiles: OpenFile[];
  activeFileUri: string;
  dispatch: Dispatch<any>;
};

type OpenFilesPaneInnerProps = {
} & OpenFilesPaneOuterProps;

const BaseOpenFilesPaneComponent = ({ activeFileUri, openFiles, dispatch }) => {
  return <PaneComponent header="Open Files" className="m-open-files-pane">
    {
      openFiles.map((openFile) => {
        return <OpenFileComponent openFile={openFile} dispatch={dispatch} active={activeFileUri === openFile.uri}/>
      })
    }
  </PaneComponent>;
};


export const OpenFilesPaneComponent = compose<OpenFilesPaneInnerProps, OpenFilesPaneOuterProps>(
  pure
)(BaseOpenFilesPaneComponent);
