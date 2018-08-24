import * as React from "react";
import { DependencyGraph, SyntheticDocument } from "paperclip";
import { InspectorNode } from "state/pc-inspector-tree";
import { Dispatch } from "redux";

export type LayersPaneContextProps = {
  graph: DependencyGraph;
  hoveringInspectorNodeIds: string[];
  selectedInspectorNodeIds: string[];
  rootSourceNodeInspector: InspectorNode;
  document: SyntheticDocument;
  documents: SyntheticDocument[];
  dispatch: Dispatch<any>;
};

export const LayersPaneContext = React.createContext<LayersPaneContextProps>(
  null
);

export const withLayersPaneContext = function<TContextProps, TOuterProps>(
  computeProperties: (
    props: TOuterProps,
    context: LayersPaneContextProps
  ) => TContextProps
) {
  return (Base: React.ComponentClass<TOuterProps & TContextProps>) => {
    return (props: TOuterProps) => {
      return (
        <LayersPaneContext.Consumer>
          {(context: LayersPaneContextProps) => (
            <Base {...props} {...computeProperties(props, context)} />
          )}
        </LayersPaneContext.Consumer>
      );
    };
  };
};
