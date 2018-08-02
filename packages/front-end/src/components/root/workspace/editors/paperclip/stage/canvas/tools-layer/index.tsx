/**
 * tools overlay like measurements, resizers, etc
 */

import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { pure, compose } from "recompose";
import {
  RootState,
  EditorWindow,
  getOpenFile
} from "../../../../../../../../state";
import { NodeOverlaysTool } from "./document-overlay";
import { SelectionCanvasTool } from "./selection";
const { Frames } = require("./frames-view.pc");
import { InsertLayer } from "./insert-layer";
import {
  getSyntheticDocumentByDependencyUri,
  SyntheticDocument,
  DependencyGraph,
  getSyntheticVisibleNodeRelativeBounds,
  Frame,
  getPCNode
} from "paperclip";
import {
  getNestedTreeNodeById,
  memoize,
  mergeBounds,
  Bounds,
  findNestedNode
} from "tandem-common";
import {
  InspectorNode,
  getInspectorSyntheticNode,
  InspectorTreeNodeName,
  getInsertableInspectorNode,
  getInspectorNodeOwnerInstance
} from "state/pc-inspector-tree";

export type ToolsLayerComponent = {
  editorWindow: EditorWindow;
  root: RootState;
  zoom: number;
  dispatch: Dispatch<any>;
};

const BaseToolsLayerComponent = ({
  editorWindow,
  root,
  zoom,
  dispatch
}: ToolsLayerComponent) => {
  const canvas = getOpenFile(editorWindow.activeFilePath, root).canvas;
  const insertInspectorNode = root.hoveringInspectorNodeIds.length
    ? getNestedTreeNodeById(
        root.hoveringInspectorNodeIds[0],
        root.sourceNodeInspector
      )
    : null;
  const insertInspectorNodeBounds =
    insertInspectorNode &&
    calcInspectorNodeBounds(
      insertInspectorNode,
      root.sourceNodeInspector,
      root.documents,
      root.frames,
      root.graph
    );
  return (
    <div className="m-tools-layer">
      <InsertLayer
        canvas={canvas}
        zoom={zoom}
        editorWindow={editorWindow}
        toolType={root.toolType}
        dispatch={dispatch}
        insertInspectorNode={insertInspectorNode}
        insertInspectorNodeBounds={insertInspectorNodeBounds}
      />
      <Frames
        root={root}
        canvas={canvas}
        translate={canvas.translate}
        dispatch={dispatch}
        editorWindow={editorWindow}
      />
      <NodeOverlaysTool
        root={root}
        zoom={zoom}
        dispatch={dispatch}
        document={getSyntheticDocumentByDependencyUri(
          editorWindow.activeFilePath,
          root.documents,
          root.graph
        )}
        editorWindow={editorWindow}
      />
      <SelectionCanvasTool
        canvas={canvas}
        root={root}
        dispatch={dispatch}
        zoom={zoom}
        document={getSyntheticDocumentByDependencyUri(
          editorWindow.activeFilePath,
          root.documents,
          root.graph
        )}
        editorWindow={editorWindow}
      />
    </div>
  );
};

export const ToolsLayerComponent = compose<
  ToolsLayerComponent,
  ToolsLayerComponent
>(pure)(BaseToolsLayerComponent);

const calcInspectorNodeBounds = memoize(
  (
    inspectorNode: InspectorNode,
    root: InspectorNode,
    documents: SyntheticDocument[],
    frames: Frame[],
    graph: DependencyGraph
  ): Bounds => {
    const assocSyntheticNode = getInspectorSyntheticNode(
      inspectorNode,
      documents,
      graph
    );

    if (assocSyntheticNode) {
      return getSyntheticVisibleNodeRelativeBounds(
        assocSyntheticNode,
        frames,
        graph
      );
    }

    let assocInspectorNode: InspectorNode;

    if (inspectorNode.name === InspectorTreeNodeName.CONTENT) {
      const instance = getInspectorNodeOwnerInstance(inspectorNode, root);

      // find the slot
      assocInspectorNode = findNestedNode(
        instance,
        (child: InspectorNode) =>
          child.assocSourceNodeId === inspectorNode.assocSourceNodeId &&
          child.name === InspectorTreeNodeName.SOURCE_REP
      );
    } else {
      assocInspectorNode = inspectorNode;
    }

    return mergeBounds(
      ...assocInspectorNode.children
        .map(child => {
          const assocChildSyntheticNode = getInspectorSyntheticNode(
            child,
            documents,
            graph
          );
          return (
            assocChildSyntheticNode &&
            getSyntheticVisibleNodeRelativeBounds(
              assocChildSyntheticNode,
              frames,
              graph
            )
          );
        })
        .filter(Boolean)
    );
  }
);
