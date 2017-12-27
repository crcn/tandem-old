import "./artboards.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Workspace } from "front-end/state";
import { Dispatcher, getBoundsSize, Translate, wrapEventToDispatch } from "aerial-common2";
import { stageToolArtboardTitleClicked, stageToolWindowKeyDown, stageToolWindowBackgroundClicked, openExternalWindowButtonClicked } from "front-end/actions";
import { Artboard, getArtboardLabel } from "front-end/state";

type ArtboardItemInnerProps = {
  artboard: Artboard;
  dispatch: Dispatcher<any>;
  translate: Translate;
  fullScreenArtboardId: string;
};

const ArtboardItemBase = ({ artboard, translate, dispatch, fullScreenArtboardId }: ArtboardItemInnerProps) => {

  if (fullScreenArtboardId && fullScreenArtboardId !== artboard.$id) {
    return null;
  }

  const { width, height } = getBoundsSize(artboard.bounds);

  const style = {
    width,
    height,
    left: artboard.bounds.left,
    top: artboard.bounds.top,
    background: "transparent",
  };

  const titleScale = Math.max(1 / translate.zoom, 0.03);

  const titleStyle = {
    transform: `translateY(-${20 * titleScale}px) scale(${titleScale})`,
    transformOrigin: "top left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: width * translate.zoom,
  };

  const contentStyle = {
    // boxShadow: `0 0 0 ${titleScale}px #DFDFDF`
    background: "transparent"
  };
  
  return <div className="m-artboards-stage-tool-item" style={style}>
    <div 
    className="m-artboards-stage-tool-item-title" 
    tabIndex={-1} 
    style={titleStyle as any} 
    onKeyDown={wrapEventToDispatch(dispatch, stageToolWindowKeyDown.bind(this, artboard.$id))} 
    onClick={wrapEventToDispatch(dispatch, stageToolArtboardTitleClicked.bind(this, artboard.$id))}>
      { getArtboardLabel(artboard) }

      {/* TODO: eventually this should point to browserstack -- whatever the navigator agent is of the artboard */}
      <i className="ion-share" onClick={wrapEventToDispatch(dispatch, openExternalWindowButtonClicked.bind(this, artboard.$id))} />
    </div>
    <div className="m-artboards-stage-tool-item-content" style={contentStyle}>

    </div>
  </div>
};

const ArtboardItem = pure(ArtboardItemBase as any) as typeof ArtboardItemBase;

export type ArtboardsStageToolInnerProps = {
  translate: Translate;
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export const ArtboardsStageToolBase = ({ workspace, translate, dispatch }: ArtboardsStageToolInnerProps) => {
  const { backgroundColor, fullScreen } = workspace.stage;

  const backgroundStyle = {
    backgroundColor: backgroundColor || "rgba(0, 0, 0, 0.05)",
    transform: `translate(${-translate.left / translate.zoom}px, ${-translate.top / translate.zoom}px) scale(${1 / translate.zoom}) translateZ(0)`,
    transformOrigin: "top left"
  };
  return <div className="m-artboards-stage-tool">
    <div style={backgroundStyle} className="m-artboards-stage-tool-background" onClick={wrapEventToDispatch(dispatch, stageToolWindowBackgroundClicked)} /> 
    {
      workspace.artboards.map((artboard) => <ArtboardItem key={artboard.$id} artboard={artboard} fullScreenArtboardId={fullScreen && fullScreen.artboardId} dispatch={dispatch} translate={translate} />)
    }
  </div>;
}

export const ArtboardsStageTool = pure(ArtboardsStageToolBase as any) as typeof ArtboardsStageToolBase;