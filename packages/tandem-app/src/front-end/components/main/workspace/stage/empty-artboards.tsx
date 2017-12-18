import "./empty-artboards.scss";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { Dispatcher } from "aerial-common2";
import { emptyWindowsUrlAdded } from "front-end/actions";

export type EmptyWindowsPropsOuter = {
};

export type EmptyWindowsPropsInner = {
} & EmptyWindowsPropsOuter;

const EmptyArtboardsBase = () => {
  return <div className="m-empty-artboards">
    Drag and drop a component here.
  </div>;
}

const enhanceEmptyArboards = compose<EmptyWindowsPropsInner, EmptyWindowsPropsOuter>(
  pure,
  withHandlers({
  })
);

export const EmptyArtboards = enhanceEmptyArboards(EmptyArtboardsBase);
