import * as React from "react";
import { BaseFileNavigatorProps, FileNavigatorLayer } from "./view.pc";
import { Directory, memoize } from "tandem-common";
import { Dispatch } from "redux";
import { FileNavigatorContext, FileNavigatorContextProps } from "./contexts";
export type Props = {
  rootDirectory: Directory;
  dispatch: Dispatch<any>;
  selectedFileNodeIds: string[];
} & BaseFileNavigatorProps;

const generateFileNavigatorContext = memoize(
  (
    selectedFileNodeIds: string[],
    dispatch: Dispatch<any>
  ): FileNavigatorContextProps => ({
    selectedFileNodeIds,
    dispatch
  })
);

export default (Base: React.ComponentClass<BaseFileNavigatorProps>) =>
  class FileNavigatorController extends React.PureComponent<Props> {
    render() {
      const {
        dispatch,
        rootDirectory,
        selectedFileNodeIds,
        ...rest
      } = this.props;

      const content = rootDirectory.children.map(child => {
        return <FileNavigatorLayer key={child.id} item={child} />;
      });

      return (
        <FileNavigatorContext.Provider
          value={generateFileNavigatorContext(selectedFileNodeIds, dispatch)}
        >
          <Base {...rest} content={content} />
        </FileNavigatorContext.Provider>
      );
    }
  };
