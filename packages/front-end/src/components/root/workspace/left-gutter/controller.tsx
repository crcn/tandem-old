import * as React from "react";
import { BaseLeftGutterProps } from "./view.pc";
import { DependencyGraph, InspectorNode, SyntheticDocument } from "paperclip";
import { Dispatch } from "redux";
import { Directory } from "tandem-common";
export type Props = {
  show?: boolean;
  graph: DependencyGraph;
  selectedInspectorNodeIds: string[];
  hoveringInspectorNodeIds: string[];
  selectedFileNodeIds: string[];
  sourceNodeInspector: InspectorNode;
  rootDirectory: Directory;
  dispatch: Dispatch<any>;
  documents: SyntheticDocument[];
} & BaseLeftGutterProps;

export default (Base: React.ComponentClass<BaseLeftGutterProps>) =>
  class LeftGutterController extends React.PureComponent<Props> {
    render() {
      const {
        graph,
        selectedInspectorNodeIds,
        hoveringInspectorNodeIds,
        selectedFileNodeIds,
        sourceNodeInspector,
        dispatch,
        documents,
        rootDirectory,
        show,
        ...rest
      } = this.props;
      if (show === false) {
        return null;
      }

      return (
        <Base
          {...rest}
          openModulesPaneProps={{
            graph,
            selectedInspectorNodeIds,
            hoveringInspectorNodeIds,
            sourceNodeInspector,
            dispatch,
            documents
          }}
          fileNavigatorPaneProps={{
            rootDirectory,
            dispatch,
            selectedFileNodeIds
          }}
        />
      );
    }
  };
