import * as React from "react";
import { Dispatch } from "redux";
import { InspectorNode, DependencyGraph } from "paperclip";
import { BaseEditorFooterProps } from "./view.pc";

export type Props = {
  graph: DependencyGraph;
  rootInspectorNode: InspectorNode;
  selectedInspectorNode: InspectorNode;
  dispatch: Dispatch<any>;
} & BaseEditorFooterProps;

export default (Base: React.ComponentClass<BaseEditorFooterProps>) =>
  class FooterController extends React.PureComponent<Props> {
    render() {
      const {
        graph,
        rootInspectorNode,
        selectedInspectorNode,
        dispatch,
        ...rest
      } = this.props;
      return (
        <Base
          {...rest}
          breadcrumbsProps={{
            dispatch,
            graph,
            rootInspectorNode,
            selectedInspectorNode
          }}
        />
      );
    }
  };
