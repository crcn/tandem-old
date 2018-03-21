// TODO:
// implement collapse all functionality
// double click open file
// files selectable

import "./index.scss";
import { compose, pure, withProps, withReducer, withHandlers, withState } from "recompose";
import * as React from "react";
import * as cx from "classnames";
// import { crea } from "react-dnd";
import { Pane } from "front-end/components/pane";

export type FileNavigatorOuterProps = {
  
};

enum FSItemType {
  FILE,
  DIRECTORY
};

type FSItem = {
  type: FSItemType;
  name: string;
}

type Directory = {
  files: (File|Directory)[];
} & FSItem;

type File = {
} & FSItem;

export type FileNavigatorInnerProps = {
  rootDirectory: Directory
};

type FSItemComponentOuterProps = {
  file: FSItem;
  depth: number;
}

type FSItemComponentInnerProps = {
  open: boolean;
  onLabelClick: () => any;
} & FSItemComponentOuterProps;

const FSItemComponent = compose<FSItemComponentInnerProps, FSItemComponentOuterProps>(
  pure,
  withState("open", "setOpen", false),
  withHandlers({
    onLabelClick: ({ open, setOpen }) => () => {
      setOpen(!open);
    }
  })
)(({file, depth, open, onLabelClick}) => {
  let children;
  const isDirectory = file.type === FSItemType.DIRECTORY;

  if (isDirectory && open) {
    children = (file as Directory).files.map(file => {
      return <FSItemComponent depth={depth + 1} file={file} />
    })
  }

  const labelStyle = {
    paddingLeft: depth * 8
  };

  return <div className="m-fs-item">
    <div className="label" onClick={onLabelClick} style={labelStyle}>
      { isDirectory ? <i className={cx({"ion-arrow-right-b": !open, "ion-arrow-down-b": open })}></i> : <i /> }
      {file.name}
    </div>
    <div className="children">{children}</div> 
  </div>
});

export const BaseFileNavigatorComponent = ({rootDirectory}: FileNavigatorInnerProps) => {
  return <Pane className="m-file-navigator-pane" title={rootDirectory.name}> 
    {
      rootDirectory.files.map(file => <FSItemComponent file={file} depth={2} />)
    }
  </Pane>
};

const ROOT_DIRECTORY: Directory = {
  type: FSItemType.DIRECTORY,
  name: "/",
  files: [
    {
      name: "components",
      type: FSItemType.DIRECTORY,
      files: [
        {
          name: "workspace",
          type: FSItemType.DIRECTORY,
          files: [
            {
              name: "component.pc",
              type: FSItemType.FILE
            }
          ]
        }
      ]
    }
  ]
}


export const FileNavigator = compose<FileNavigatorInnerProps, FileNavigatorOuterProps>(
  pure,
  withProps((props) => ({
    rootDirectory: ROOT_DIRECTORY
  }))
)(BaseFileNavigatorComponent);



// import "./index.scss";
// import * as React from "react";
// import { compose, pure } from "recompose";
// import { Tree } from "../../../../tree";
// import { Pane } from "../../../../pane";
// import {DIRECTORY } from "../../../../../state";
// import { FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED, FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED } from "front-end/actions";
// import { immutable, TreeNode, Dispatcher, wrapEventToDispatch, wrappedEvent } from "aerial-common2";

// const getFileLabel = (node: File) => `/${node.name}`;
// const collapsible = (node: File) => node.$type === DIRECTORY;

// const enhanceFileNavigator = compose(
//   pure
// ) as any;

// export type FileNavigatorProps = {
//   directory: Directory,
//   dispatch?: Dispatcher<any>
// }

// type FileNavigatorControlsProps = {
//   dispatch: Dispatcher<any>
// }


// const FileNavigatorControlsBase = ({ dispatch }: FileNavigatorControlsProps) => <span className="hide">
//   <a href="#" onClick={wrapEventToDispatch(dispatch, wrappedEvent.bind(this, FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED))}><i className="icon ion-document-text" /></a> &nbsp;
//   <a href="#" onClick={wrapEventToDispatch(dispatch, wrappedEvent.bind(this, FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED))}><i className="icon ion-ios-folder" /></a>
// </span>;

// const FileNavigatorControls = pure(FileNavigatorControlsBase as any) as typeof FileNavigatorControlsBase;

// export const FileNavigatorBase = ({ directory, dispatch }: FileNavigatorProps) => <div className="file-navigator-component">
//   <Pane title="Files" controls={<FileNavigatorControls dispatch={dispatch} />}>
//     <Tree rootNode={directory} getLabel={getFileLabel} collapsible={collapsible} dispatch={dispatch} />
//   </Pane>
// </div>;

// export const FileNavigator = enhanceFileNavigator(FileNavigatorBase) as typeof FileNavigatorBase;