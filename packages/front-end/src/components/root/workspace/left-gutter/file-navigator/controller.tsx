import * as React from "react";
import {
  BaseFileNavigatorProps,
  FileNavigatorLayer,
  NewFileInput
} from "./view.pc";
import {
  Directory,
  memoize,
  FSItemTagNames,
  getNestedTreeNodeById,
  FSItem,
  getParentTreeNode,
  EMPTY_ARRAY
} from "tandem-common";
import { Dispatch } from "redux";
import { FileNavigatorContext, FileNavigatorContextProps } from "./contexts";
import { fileNavigatorNewFileEntered } from "../../../../../actions";
export type Props = {
  rootDirectory: Directory;
  dispatch: Dispatch<any>;
  selectedFileNodeIds: string[];
} & BaseFileNavigatorProps;

const generateFileNavigatorContext = memoize(
  (
    addingFSItemDirectory: Directory,
    selectedFileNodeIds: string[],
    onNewFileChangeComplete: any,
    dispatch: Dispatch<any>
  ): FileNavigatorContextProps => ({
    addingFSItemDirectory,
    selectedFileNodeIds,
    onNewFileChangeComplete,
    dispatch
  })
);

type State = {
  addingFSItem?: FSItemTagNames;
  addingFSItemDirectory?: Directory;
};

export default (Base: React.ComponentClass<BaseFileNavigatorProps>) =>
  class FileNavigatorController extends React.PureComponent<Props, State> {
    state = {
      addingFSItem: null,
      addingFSItemDirectory: null
    };
    onAddFileButtonClick = () => {
      this.setAddingFSItem(FSItemTagNames.FILE);
    };
    onAddFolderButtonClick = () => {
      this.setAddingFSItem(FSItemTagNames.DIRECTORY);
    };
    onNewFileChangeComplete = (name: string) => {
      this.props.dispatch(
        fileNavigatorNewFileEntered(
          name,
          this.state.addingFSItem,
          this.state.addingFSItemDirectory.id
        )
      );
      this.setState({
        ...this.state,
        addingFSItem: null,
        addingFSItemDirectory: null
      });
    };
    private setAddingFSItem = (type: FSItemTagNames) => {
      const selectedFileNode: FSItem = getNestedTreeNodeById(
        this.props.selectedFileNodeIds[0],
        this.props.rootDirectory
      );
      const dirFile = selectedFileNode
        ? selectedFileNode.name === FSItemTagNames.DIRECTORY
          ? selectedFileNode
          : getParentTreeNode(selectedFileNode.id, this.props.rootDirectory)
        : this.props.rootDirectory;
      this.setState({
        ...this.state,
        addingFSItem: type,
        addingFSItemDirectory: dirFile
      });
    };
    render() {
      const {
        dispatch,
        rootDirectory,
        selectedFileNodeIds,
        ...rest
      } = this.props;

      if (!rootDirectory) {
        return <Base content={EMPTY_ARRAY} />
      }
      const {
        onAddFileButtonClick,
        onAddFolderButtonClick,
        onNewFileChangeComplete
      } = this;
      const { addingFSItemDirectory } = this.state;

      const content = rootDirectory.children.map(child => {
        return <FileNavigatorLayer key={child.id} item={child} />;
      });

      if (
        addingFSItemDirectory &&
        rootDirectory.uri === addingFSItemDirectory.uri
      ) {
        content.unshift(
          <NewFileInput
            key="new-file-input"
            onChangeComplete={onNewFileChangeComplete}
          />
        );
      }

      return (
        <FileNavigatorContext.Provider
          value={generateFileNavigatorContext(
            addingFSItemDirectory,
            selectedFileNodeIds,
            onNewFileChangeComplete,
            dispatch
          )}
        >
          <Base
            {...rest}
            content={content}
            addFileButtonProps={{
              onClick: onAddFileButtonClick
            }}
            addFolderButtonProps={{ onClick: onAddFolderButtonClick }}
          />
        </FileNavigatorContext.Provider>
      );
    }
  };
