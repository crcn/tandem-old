import "./index.scss";
import * as React from "react";
import { SyntheticWindow, SyntheticBrowser, SyntheticNode, SyntheticDocument } from "../../../../../../../../paperclip";
import { compose, pure } from "recompose"
import { getAttribute, EMPTY_ARRAY } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { PREVIEW_NAMESPACE } from "../../../../../../../state";

type SyntheticNodeLayerOuterProps = {
  node: SyntheticNode;
  depth: number;
  dispatch: Dispatch<any>;
};

type SyntheticNodeLayerInnerProps = {

} & SyntheticNodeLayerOuterProps;

const BaseSyntheticNodeLayerComponent = ({ node, depth, dispatch }: SyntheticNodeLayerInnerProps) => {
  const labelStyle = {
    paddingLeft: 30 + depth * 8
  }
  return <div className="m-synthetic-node-layer">
    <div className="label" style={labelStyle}>
      { getAttribute(node, "label", PREVIEW_NAMESPACE) || "Untitled" }
    </div>
    <div className="children">
      {
        node.children.map(child => {
          return <SyntheticNodeLayerComponent key={child.id} node={child as SyntheticNode} depth={depth + 1} dispatch={dispatch} />
        })
      }
    </div>
  </div>;
};

const SyntheticNodeLayerComponent = compose<SyntheticNodeLayerInnerProps, SyntheticNodeLayerOuterProps>(
  pure
)(BaseSyntheticNodeLayerComponent);

type SyntheticDocumentLayerOuterProps = {
  dispatch: Dispatch<any>;
  document: SyntheticDocument;
}

type SyntheticDocumentLayerInnerProps = {

} & SyntheticDocumentLayerOuterProps;


const BaseSyntheticDocumentLayerComponent = ({ dispatch, document }: SyntheticDocumentLayerOuterProps) => {
  return <div className="m-synthetic-document-layer">
    <div className="label">
      Component
    </div>
    <div className="children">
      {
        document.root.children.map(child => {
          return <SyntheticNodeLayerComponent key={child.id} node={child as SyntheticNode} dispatch={dispatch} depth={1} />
        })
      }
    </div>
  </div>;
};

const SyntheticDocumentLayerComponent = compose<SyntheticDocumentLayerInnerProps, SyntheticDocumentLayerOuterProps>(
  pure
)(BaseSyntheticDocumentLayerComponent);

type SyntheticWindowLayersOuterProps = {
  dispatch: Dispatch<any>;
  window: SyntheticWindow;
  browser: SyntheticBrowser;
};

type SyntheticWindowLayersInnerProps = {

} & SyntheticWindowLayersOuterProps;

const BaseSyntheticWindowLayersComponent = ({ dispatch, window, browser }: SyntheticWindowLayersInnerProps) => {
  return <div className="m-synthetic-window-layers">
    {
      (window.documents || EMPTY_ARRAY).map(document => {
        return <SyntheticDocumentLayerComponent document={document} dispatch={dispatch} />
      })
    }
  </div>;
};

export const SyntheticWindowLayersComponent = compose<SyntheticWindowLayersInnerProps, SyntheticWindowLayersOuterProps>(
  pure
)(BaseSyntheticWindowLayersComponent);