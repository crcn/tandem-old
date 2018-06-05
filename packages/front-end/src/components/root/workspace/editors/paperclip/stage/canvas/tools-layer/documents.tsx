import "./documents.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Translate, getBoundsSize } from "tandem-common";
import { RootState, Editor } from "../../../../../../../../state";
import { wrapEventToDispatch } from "../../../../../../../../utils";
import { Dispatch } from "redux";
import {
  DependencyGraph,
  Frame,
  SyntheticVisibleNode,
  getFramesByDependencyUri,
  getSyntheticNodeById
} from "paperclip";
import {
  canvasToolDocumentTitleClicked,
  canvasToolWindowKeyDown,
  canvasToolWindowBackgroundClicked
} from "../../../../../../../../actions";

type DocumentItemInnerProps = {
  frame: Frame;
  contentNode: SyntheticVisibleNode;
  dispatch: Dispatch<any>;
  translate: Translate;
};

const DocumentItemBase = ({
  frame,
  contentNode,
  translate,
  dispatch
}: DocumentItemInnerProps) => {
  const { width, height } = getBoundsSize(frame.bounds);

  const style = {
    width,
    height,
    left: frame.bounds.left,
    top: frame.bounds.top,
    background: "transparent"
  };

  const titleScale = Math.max(1 / translate.zoom, 0.03);

  const titleStyle = {
    transform: `translateY(-${20 * titleScale}px) scale(${titleScale})`,
    transformOrigin: "top left",
    whiteSpace: "nowrap",

    // some random height to prevent text from getting cut off
    // when zooming.
    height: 30,
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: width * translate.zoom
  };

  const contentStyle = {
    // boxShadow: `0 0 0 ${titleScale}px #DFDFDF`
    background: "transparent"
  };

  return (
    <div className="m-documents-stage-tool-item" style={style}>
      <div
        className="m-documents-stage-tool-item-title"
        tabIndex={-1}
        style={titleStyle as any}
        onKeyDown={wrapEventToDispatch(
          dispatch,
          canvasToolWindowKeyDown.bind(this, frame.contentNodeId)
        )}
        onClick={wrapEventToDispatch(
          dispatch,
          canvasToolDocumentTitleClicked.bind(this, frame)
        )}
      >
        {contentNode.label || "Untitled"}
      </div>
      <div
        className="m-documents-stage-tool-item-content"
        style={contentStyle}
      />
    </div>
  );
};

const DocumentItem = pure(DocumentItemBase as any) as typeof DocumentItemBase;

export type DocumentsCanvasToolInnerProps = {
  editor: Editor;
  translate: Translate;
  root: RootState;
  dispatch: Dispatch<any>;
};

export const DocumentsCanvasToolBase = ({
  root,
  editor,
  translate,
  dispatch
}: DocumentsCanvasToolInnerProps) => {
  const { backgroundColor, fullScreen } = editor.canvas;

  const activeFrames = getFramesByDependencyUri(
    editor.activeFilePath,
    root.frames,
    root.documents,
    root.graph
  );

  if (!activeFrames || !activeFrames) {
    return null;
  }

  const backgroundStyle = {
    backgroundColor: backgroundColor || "rgba(0, 0, 0, 0.05)",
    transform: `translate(${-translate.left /
      translate.zoom}px, ${-translate.top / translate.zoom}px) scale(${1 /
      translate.zoom}) translateZ(0)`,
    transformOrigin: "top left"
  };
  return (
    <div className="m-documents-stage-tool">
      <div
        style={backgroundStyle}
        className="m-documents-stage-tool-background"
        onClick={wrapEventToDispatch(
          dispatch,
          canvasToolWindowBackgroundClicked
        )}
      />
      {activeFrames.map(frame => (
        <DocumentItem
          key={frame.contentNodeId}
          contentNode={getSyntheticNodeById(
            frame.contentNodeId,
            root.documents
          )}
          frame={frame}
          dispatch={dispatch}
          translate={translate}
        />
      ))}
    </div>
  );
};

export const DocumentsCanvasTool = pure(
  DocumentsCanvasToolBase as any
) as typeof DocumentsCanvasToolBase;
