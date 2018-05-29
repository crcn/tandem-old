import "./index.scss";
import * as path from "path";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { PaneComponent } from "../../../../pane";
import * as cx from "classnames";
import { Dispatch } from "redux";
import {
  Directory,
  File,
  FileAttributeNames,
  EMPTY_ARRAY,
  TreeNode,
  filterNestedNodes,
  FSItemNamespaces,
  memoize,
  FSItem
} from "tandem-common";
import {
  fileNavigatorItemClicked,
  fileNavigatorItemDoubleClicked,
  fileNavigatorToggleDirectoryClicked,
  fileNavigatorDroppedItem,
  newFileEntered,
  newDirectoryEntered,
  fileNavigatorNewFileClicked,
  fileNavigatorNewDirectoryClicked,
  fileNavigatorNewFileEntered
} from "../../../../../actions";
import {
  createTreeLayerComponents,
  TreeNodeLayerOuterProps
} from "../../../../layers";
import { InsertFileInfo } from "../../../../../state";
import { FocusComponent } from "../../../../focus";

type NewFileInputOuterProps = {
  dispatch: Dispatch<any>;
  depth: number;
};

type NewFileInputInnerProps = {
  onKeyDown: any;
} & NewFileInputOuterProps;

const BaseFileInputComponent = ({
  depth,
  onKeyDown
}: NewFileInputInnerProps) => {
  const style = {
    marginLeft: depth * 8
  };
  return (
    <div style={style} className="new-file-input">
      <FocusComponent>
        <input type="text" onKeyDown={onKeyDown} />
      </FocusComponent>
    </div>
  );
};

const FileInputComponent = compose<
  NewFileInputInnerProps,
  NewFileInputOuterProps
>(
  pure,
  withHandlers({
    onKeyDown: ({ dispatch }) => (event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter") {
        dispatch(fileNavigatorNewFileEntered((event.target as any).value));
      }
    }
  })
)(BaseFileInputComponent);

type FileNodeLayerOuterProps = {
  insertFileInfo: InsertFileInfo;
} & TreeNodeLayerOuterProps;

const { TreeNodeLayerComponent } = createTreeLayerComponents<
  FileNodeLayerOuterProps
>({
  actionCreators: {
    treeLayerClick: fileNavigatorItemClicked,
    treeLayerDoubleClick: fileNavigatorItemDoubleClicked,
    treeLayerDroppedNode: fileNavigatorDroppedItem,
    treeLayerExpandToggleClick: fileNavigatorToggleDirectoryClicked
  },
  dragType: "FILE",
  reorganizable: false,
  depthOffset: 0,
  attributeOptions: {
    nodeLabelAttr: (node: FSItem) => path.basename(node.uri),
    expandAttr: (node: FSItem) => node.expanded
  },
  hasChildren: (node: TreeNode<any>) => {
    return node.name === "directory";
  },
  childRenderer: Base => ({
    node,
    hoveringNodeIds,
    selectedNodeIds,
    depth,
    dispatch,
    insertFileInfo
  }: FileNodeLayerOuterProps) => {
    return [
      insertFileInfo != null && node.id === insertFileInfo.directoryId ? (
        <FileInputComponent dispatch={dispatch} depth={depth} />
      ) : null,
      ...node.children.map(child => {
        return (
          <Base
            hoveringNodeIds={hoveringNodeIds}
            selectedNodeIds={selectedNodeIds}
            key={child.id}
            node={child as TreeNode<any>}
            depth={depth + 1}
            dispatch={dispatch}
            insertFileInfo={insertFileInfo}
          />
        );
      })
    ];
  }
});

type FileNavigatorHeaderComponentOuterProps = {
  onAddFileButtonClick: () => any;
  onAddDirectoryButtonClick: () => any;
};

const BaseFileNavigatorHeaderComponent = ({
  onAddFileButtonClick,
  onAddDirectoryButtonClick
}: FileNavigatorHeaderComponentOuterProps) => (
  <div className="header">
    Files{" "}
    <span className="controls">
      <i className="ion-document" onClick={onAddFileButtonClick} />
      <i className="ion-folder" onClick={onAddDirectoryButtonClick} />
    </span>
  </div>
);

type FileNavigatorPaneOuterProps = {
  insertFileInfo: InsertFileInfo;
  selectedFileNodeIds: string[];
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
};

type FileNavigatorPaneInnerProps = {
  onAddDirectoryButtonClick: () => any;
  onAddFileButtonClick: () => any;
} & FileNavigatorPaneOuterProps;

const FileNavigatorHeaderComponent = BaseFileNavigatorHeaderComponent;

const BaseFileNavigatorPaneComponent = ({
  insertFileInfo,
  selectedFileNodeIds,
  rootDirectory,
  dispatch,
  onAddDirectoryButtonClick,
  onAddFileButtonClick
}: FileNavigatorPaneInnerProps) => {
  if (!rootDirectory) {
    return null;
  }

  return (
    <PaneComponent
      header={
        <FileNavigatorHeaderComponent
          onAddDirectoryButtonClick={onAddDirectoryButtonClick}
          onAddFileButtonClick={onAddFileButtonClick}
        />
      }
      className="m-file-navigator-pane"
    >
      {insertFileInfo != null &&
      rootDirectory.id === insertFileInfo.directoryId ? (
        <FileInputComponent dispatch={dispatch} depth={1} />
      ) : null}
      {rootDirectory.children.map(file => {
        return (
          <TreeNodeLayerComponent
            key={file.id}
            insertFileInfo={insertFileInfo}
            hoveringNodeIds={EMPTY_ARRAY}
            selectedNodeIds={selectedFileNodeIds}
            node={file as File}
            depth={1}
            dispatch={dispatch}
          />
        );
      })}
    </PaneComponent>
  );
};

export const FileNavigatorPaneComponent = compose<
  FileNavigatorPaneInnerProps,
  FileNavigatorPaneOuterProps
>(
  pure,
  withHandlers({
    onAddDirectoryButtonClick: ({ dispatch }) => () => {
      dispatch(fileNavigatorNewDirectoryClicked());
    },
    onAddFileButtonClick: ({ dispatch }) => () => {
      dispatch(fileNavigatorNewFileClicked());
    }
  })
)(BaseFileNavigatorPaneComponent);
