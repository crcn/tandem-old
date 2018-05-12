

import "./index.scss";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { PaneComponent } from "../../../../pane";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { Directory, File, getAttribute, FileAttributeNames, EMPTY_ARRAY, TreeNode, filterNestedNodes, memoize } from "../../../../../../common";
import { fileNavigatorItemClicked, fileNavigatorItemDoubleClicked, newFileEntered, newDirectoryEntered } from "../../../../../actions";
import { createTreeLayerComponents } from "../../../../layers";

/*

TODO:

- [ ] create new file
- [ ] add new folder
*/


const { TreeNodeLayerComponent } = createTreeLayerComponents({
  actionCreators: {
    treeLayerClick: fileNavigatorItemClicked,
    treeLayerDoubleClick: fileNavigatorItemDoubleClicked,
  },
  dragType: "FILE",
  reorganizable: false,
  depthOffset: 0,
  attributeOptions: {
    nodeLabelAttr: {
      name: "basename"
    },
    expandAttr: {
      name: "expanded"
    }
  }
});


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


type FileNavigatorPaneOuterProps = {
  selectedFileNodeIds: string[];
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
};

type FileNavigatorPaneInnerProps = {
  onAddDirectoryButtonClick: () => any;
  onAddFileButtonClick: () => any;
} & FileNavigatorPaneOuterProps

const FileNavigatorHeaderComponent = BaseFileNavigatorHeaderComponent;


const BaseFileNavigatorPaneComponent = ({selectedFileNodeIds, rootDirectory, dispatch, onAddDirectoryButtonClick, onAddFileButtonClick}: FileNavigatorPaneInnerProps) => {
  if (!rootDirectory) {
    return null;
  }

  return <PaneComponent header={<FileNavigatorHeaderComponent onAddDirectoryButtonClick={onAddDirectoryButtonClick} onAddFileButtonClick={onAddFileButtonClick} />} className="m-file-navigator-pane">
      {rootDirectory.children.map(file => {
        return <TreeNodeLayerComponent key={file.id} hoveringNodeIds={EMPTY_ARRAY} selectedNodeIds={selectedFileNodeIds}  node={file as File} depth={1} dispatch={dispatch} />
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

