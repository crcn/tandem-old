import * as React from "react";
import { compose, pure } from "recompose";
import { RootState, EditorWindow, Canvas } from "../../../../../../../../state";
import { wrapEventToDispatch } from "../../../../../../../../utils";
import { Dispatch } from "redux";
import { Translate } from "tandem-common";
import {
  getFramesByDependencyUri,
  getSyntheticNodeById,
  getSyntheticSourceNode,
  Frame,
  SyntheticDocument,
  DependencyGraph
} from "paperclip";
const { Frame } = require("./frames-view.pc");
import { canvasToolWindowBackgroundClicked } from "../../../../../../../../actions";

export type FramesOuterProps = {
  frames: Frame[];
  documents: SyntheticDocument[];
  graph: DependencyGraph;
  editorWindow: EditorWindow;
  dispatch: Dispatch<any>;
  translate: Translate;
  canvas: Canvas;
};

export default compose<FramesOuterProps, any>(
  pure,
  Base => ({
    translate,
    editorWindow,
    frames,
    graph,
    documents,
    dispatch
  }: FramesOuterProps) => {
    const backgroundStyle = {
      transform: `translate(${-translate.left /
        translate.zoom}px, ${-translate.top / translate.zoom}px) scale(${1 /
        translate.zoom}) translateZ(0)`,
      transformOrigin: "top left"
    };

    const activeFrames = getFramesByDependencyUri(
      editorWindow.activeFilePath,
      frames,
      documents,
      graph
    );

    const frameComponents = activeFrames.map(frame => {
      const contentNode = getSyntheticNodeById(frame.contentNodeId, documents);

      const sourceNode = getSyntheticSourceNode(contentNode, graph);
      return (
        <Frame
          key={frame.contentNodeId}
          sourceNode={sourceNode}
          frame={frame}
          contentNode={contentNode}
          dispatch={dispatch}
          translate={translate}
        />
      );
    });

    return (
      <Base
        backgroundProps={{
          style: backgroundStyle,
          onClick: wrapEventToDispatch(
            dispatch,
            canvasToolWindowBackgroundClicked
          )
        }}
        contentProps={{ children: frameComponents }}
      />
    );
  }
);
