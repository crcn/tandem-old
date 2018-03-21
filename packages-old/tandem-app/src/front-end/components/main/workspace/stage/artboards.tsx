import "./artboards.scss";
const VOID_ELEMENTS = require("void-elements");

import * as React from "react";
import { findDOMNode } from "react-dom";
import { weakMemo, Dispatcher, Bounds, BaseEvent} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys } from "recompose";
import { Artboard } from "./artboard";
import { Isolate } from "front-end/components/isolated";
import { Workspace } from "front-end/state";

export type ArtboardsOuterProps = {
  workspace: Workspace;
  fullScreenArtboardId: string;
  dispatch: Dispatcher<any>;
  smooth: boolean;
};

export type ArtboardsInnerProps = ArtboardsOuterProps;

export const ArtboardsBase = ({ workspace, fullScreenArtboardId, dispatch, smooth }: ArtboardsInnerProps) => <div className="preview-component">
  {
    workspace.artboards.map((artboard) => <Artboard smooth={smooth} fullScreenArtboardId={fullScreenArtboardId} dispatch={dispatch} key={artboard.$id} artboard={artboard} />)
  }
</div>;

export const Artboards = pure(ArtboardsBase as any) as typeof ArtboardsBase;

export * from "./artboard";