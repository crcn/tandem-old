import * as React from "react";
import * as cx from "classnames";
import {
  PCSourceTagNames,
  getPCNode,
  DependencyGraph,
  SyntheticElement
} from "paperclip";
import { BasePropertiesProps } from "./view.pc";
import { InspectorNode } from "paperclip";
import { Dispatch } from "redux";

export type PropertiesControllerOuterProps = {};

export type Props = {
  visible: boolean;
  selectedNodes: SyntheticElement[];
  selectedInspectorNodes: InspectorNode[];
  graph: DependencyGraph;
  className?: string;
  dispatch: Dispatch<any>;
  sourceNodeUri: string;
} & BasePropertiesProps;

export default (Base: React.ComponentClass<BasePropertiesProps>) =>
  class PropertiesController extends React.PureComponent<Props> {
    render() {
      const {
        visible,
        className,
        selectedInspectorNodes,
        selectedNodes,
        graph,
        dispatch,
        sourceNodeUri,
        ...rest
      } = this.props;
      if (!selectedInspectorNodes.length || !visible) {
        return null;
      }

      const selectedNode = selectedInspectorNodes[0];

      const sourceNode = getPCNode(selectedNode.assocSourceNodeId, graph);

      return (
        <Base
          className={className}
          {...rest}
          variant={cx({
            slot: sourceNode.name === PCSourceTagNames.SLOT,
            component: sourceNode.name === PCSourceTagNames.COMPONENT,
            text: sourceNode.name === PCSourceTagNames.TEXT,
            element: sourceNode.name !== PCSourceTagNames.TEXT
          })}
          controllersPaneProps={{
            selectedNodes,
            graph,
            dispatch,
            sourceNodeUri
          }}
          textProps={{
            dispatch,
            selectedNodes
          }}
          elementProps={{
            selectedNodes,
            dispatch
          }}
        />
      );
    }
  };
