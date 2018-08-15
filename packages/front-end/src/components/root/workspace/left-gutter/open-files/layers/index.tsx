import * as React from "react";
import * as path from "path";
import { pure, compose } from "recompose";
import { RootState } from "../../../../../../state";
import { Dispatch } from "redux";

type LayersOuterProps = {
  dispatch: Dispatch<any>;
  root: RootState;
  uri: string;
};

type LayersInnerProps = {} & LayersOuterProps;

export const BaseLayersComponent = ({ uri }: LayersOuterProps) => {
  // only PC for now. Ideally this may also support images, and other visual documents.
  return <div />;
};

export const LayersComponent = compose<LayersInnerProps, LayersOuterProps>(
  pure
)(BaseLayersComponent);
