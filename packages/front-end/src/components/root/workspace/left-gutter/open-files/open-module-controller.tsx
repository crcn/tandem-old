import * as React from "react";
import * as path from "path";
import { OpenFile } from "state";
import { compose, pure } from "recompose";
import {
  SyntheticDocument,
  getSyntheticSourceNode,
  DependencyGraph
} from "../../../../../../node_modules/paperclip";
const { BaseLayer, NodeLayer } = require("./layer.pc");

export type OpenModuleControllerOuterProps = {
  file: OpenFile;
  document: SyntheticDocument;
  graph: DependencyGraph;
};

export default compose<
  OpenModuleControllerOuterProps,
  OpenModuleControllerOuterProps
>(
  pure,
  Base => ({
    file,
    document,
    graph,
    ...rest
  }: OpenModuleControllerOuterProps) => {
    return (
      <Base {...rest}>
        <BaseLayer
          variant="file"
          labelProps={{ text: path.basename(file.uri) }}
        />
        {document.children.map(child => {
          return (
            <NodeLayer
              depth={2}
              sourceNode={getSyntheticSourceNode(child, graph)}
              syntheticNode={child}
            />
          );
        })}
      </Base>
    );
  }
);
