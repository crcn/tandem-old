import * as React from "react";
import { Dispatch } from "redux";
export type FileNavigatorContextProps = {
  selectedFileNodeIds: string[];
  dispatch: Dispatch<any>;
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
