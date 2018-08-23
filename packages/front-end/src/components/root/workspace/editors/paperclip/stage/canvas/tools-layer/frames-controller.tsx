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
import { BaseFramesProps } from "./frames-view.pc";

export type Props = {
  frames: Frame[];
  documents: SyntheticDocument[];
  graph: DependencyGraph;
  editorWindow: EditorWindow;
  dispatch: Dispatch<any>;
  translate: Translate;
  canvas: Canvas;
};

export default compose<BaseFramesProps, Props>(
  pure,
  (Base: React.ComponentClass<BaseFramesProps>) => ({
    translate,
    editorWindow,
    frames,
    graph,
    documents,
    dispatch
  }: Props) => {
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
