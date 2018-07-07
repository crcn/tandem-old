import * as React from "react";
const { ControllerItem } = require("./controller-item.pc");
import { compose, pure } from "recompose";
import { PCComponent, getSyntheticSourceNode } from "paperclip";
import { EMPTY_ARRAY } from "tandem-common";

export default compose(
  pure,
  Base => ({ selectedNodes, graph }) => {
    if (!graph) {
      return null;
    }
    const sourceNode = getSyntheticSourceNode(
      selectedNodes[0],
      graph
    ) as PCComponent;

    const controllers = (sourceNode.controllers || EMPTY_ARRAY).map(
      relativePath => {
        return <ControllerItem relativePath={relativePath} />;
      }
    );
    return <Base contentProps={{ children: controllers }} />;
  }
);
