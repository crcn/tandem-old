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
import { mapVariablesToCSSVarDropdownOptions } from "../../right-gutter/styles/pretty/panes/utils";
import { dropdownMenuOptionFromValue, DropdownMenuOption } from "../../../../inputs/dropdown/controller";
export type Props = {
  rootDirectory: Directory;
  dispatch: Dispatch<any>;
  selectedFileNodeIds: string[];
} & BaseFileNavigatorProps;

const generateFileNavigatorContext = memoize(
  (
    newFileInfo: NewFSItemInfo,
    selectedFileNodeIds: string[],
    onNewFileChangeComplete: any,
    onNewFileInputChange: any,
    dispatch: Dispatch<any>
  ): FileNavigatorContextProps => ({
    newFileInfo,
    selectedFileNodeIds,
    onNewFileChangeComplete,
    onNewFileInputChange,
    dispatch
  })
);

enum AddFileType {
  BLANK,
  COMPONENT,
  DIRECTORY
};


export type NewFSItemInfo = {
  fileType: AddFileType;
  directory: Directory;
}


type State = {
  newFSItemInfo?: NewFSItemInfo;
};

const ADD_FILE_OPTIONS: DropdownMenuOption[] = [
  {
    label: "blank file",
    value: AddFileType.BLANK
  },
  {
    label: "component file",
    value: AddFileType.COMPONENT
  }
];

export default (Base: React.ComponentClass<BaseFileNavigatorProps>) =>
  class FileNavigatorController extends React.PureComponent<Props, State> {
    state: State = {
      newFSItemInfo: null
    };
    onAddFolderButtonClick = () => {
      this.setAddingFSItem(AddFileType.DIRECTORY);
    };
    private onFileDropdownComplete = (value: AddFileType) => {
      this.setAddingFSItem(value);
    };
    onNewFileInputChange = (value: string) => {

      // TODO - error checking here
      // console.log("ON NEW FILE INPUT", value);
    }
    onNewFileChangeComplete = (name: string) => {
      if (!name) {
        return;
      }
      const {newFSItemInfo} = this.state;

      if (newFSItemInfo.fileType === AddFileType.COMPONENT) {
        name += ".pc";
      }

      this.setState({
        ...this.state,
        newFSItemInfo: null
      });
      this.props.dispatch(
        fileNavigatorNewFileEntered(
          name,
          newFSItemInfo.fileType === AddFileType.DIRECTORY ? FSItemTagNames.DIRECTORY : FSItemTagNames.FILE,
          newFSItemInfo.directory.id
        )
      );
    };
    private setAddingFSItem = (type: AddFileType) => {
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
        newFSItemInfo: {
          fileType: type,
          directory: dirFile
        }
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
        onAddFolderButtonClick,
        onNewFileChangeComplete,
        onFileDropdownComplete,
        onNewFileInputChange
      } = this;
      const { newFSItemInfo } = this.state;

      const content = rootDirectory.children.map(child => {
        return <FileNavigatorLayer key={child.id} item={child} />;
      });

      if (
        newFSItemInfo &&
        rootDirectory.uri === newFSItemInfo.directory.uri
      ) {
        content.unshift(
          <NewFileInput
            key="new-file-input"
            onChangeComplete={onNewFileChangeComplete}
            onChange={onNewFileInputChange}
          />
        );
      }

      return (
        <FileNavigatorContext.Provider
          value={generateFileNavigatorContext(
            newFSItemInfo,
            selectedFileNodeIds,
            onNewFileChangeComplete,
            onNewFileInputChange,
            dispatch
          )}
        >
          <Base
            {...rest}
            content={content}
            addFileDropdownProps={{
              onChangeComplete: onFileDropdownComplete,
              options: ADD_FILE_OPTIONS
            }}
            addFolderButtonProps={{ onClick: onAddFolderButtonClick }}
          />
        </FileNavigatorContext.Provider>
      );
    }
  };
