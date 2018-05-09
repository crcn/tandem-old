/*

TODOS:

- [ ] display expressions within each open file

*/

import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { OpenFile, RootState } from "../../../../../state";
import { compose, pure, withHandlers } from "recompose";
import { PaneComponent } from "../../../../pane";
import * as cx from "classnames";
import * as path from "path";
import { LayersComponent } from "./layers";
import { openFilesItemClick, openFilesItemCloseClick } from "../../../../../actions";


type OpenFileOuterProps = {
  openFile: OpenFile;
  active: boolean;
  dispatch: Dispatch<any>;
  root: RootState;
}

type OpenFileInnerProps = {
  onClick: () => any;
  onCloseClick: () => any;
} & OpenFileOuterProps;

const BaseOpenFileComponent = ({ dispatch, root, openFile: { temporary, uri, newContent }, active, onClick, onCloseClick }: OpenFileInnerProps) => {

  return <div className={cx("open-file", { temporary, active, unsaved: !!newContent })} onClick={onClick}>
    <div className="label">
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
    <div className="layers">
      <LayersComponent dispatch={dispatch} root={root} uri={uri} />
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
  activeFileUri: string;
  dispatch: Dispatch<any>;
  root: RootState;
};

type OpenFilesPaneInnerProps = {
} & OpenFilesPaneOuterProps;

const BaseOpenFilesPaneComponent = ({ activeFileUri, root, dispatch }: OpenFilesPaneInnerProps) => {
  return <PaneComponent header="Open Files" className="m-open-files-pane">
    {
      root.openFiles.map((openFile) => {
        return <OpenFileComponent root={root} key={openFile.uri} openFile={openFile} dispatch={dispatch} active={activeFileUri === openFile.uri}/>
      })
    }
  </PaneComponent>;
};


export const OpenFilesPaneComponent = compose<OpenFilesPaneInnerProps, OpenFilesPaneOuterProps>(
  pure
)(BaseOpenFilesPaneComponent);
