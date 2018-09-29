import * as React from "react";
import { Dispatch } from "redux";
import { FSItemTagNames, Directory } from "tandem-common";
import { NewFSItemInfo } from "./controller";

export type FileNavigatorContextProps = {
  newFileInfo: NewFSItemInfo;
  selectedFileNodeIds: string[];
  dispatch: Dispatch<any>;
  onNewFileChangeComplete: any;
  onNewFileInputChange: any;
  activeEditorUri: string;
};

export const FileNavigatorContext = React.createContext<
  FileNavigatorContextProps
>(null);

export const withFileNavigatorContext = function<TContextProps, TOuterProps>(
  computeProperties: (
    props: TOuterProps,
    context: FileNavigatorContextProps
  ) => TContextProps
) {
  return (Base: React.ComponentClass<TOuterProps & TContextProps>) => {
    return (props: TOuterProps) => {
      return (
        <FileNavigatorContext.Consumer>
          {(context: FileNavigatorContextProps) => (
            <Base {...props} {...computeProperties(props, context)} />
          )}
        </FileNavigatorContext.Consumer>
      );
    };
  };
};
