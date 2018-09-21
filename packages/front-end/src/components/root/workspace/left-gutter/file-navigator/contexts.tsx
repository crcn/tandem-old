import * as React from "react";
import { Dispatch } from "redux";
import { FSItemTagNames, Directory } from "tandem-common";
export type FileNavigatorContextProps = {
  addingFSItemDirectory: Directory;
  selectedFileNodeIds: string[];
  dispatch: Dispatch<any>;
  onNewFileChangeComplete: any;
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
