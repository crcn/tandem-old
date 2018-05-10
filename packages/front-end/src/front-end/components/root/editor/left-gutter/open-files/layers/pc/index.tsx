import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { SyntheticWindow, SyntheticBrowser, SyntheticNode, SyntheticDocument, SyntheticObjectType, EDITOR_NAMESPACE } from "../../../../../../../../paperclip";
import { compose, pure, withHandlers } from "recompose"
import { getAttribute, EMPTY_ARRAY } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { pcLayerClick, pcLayerMouseOut, pcLayerMouseOver, pcLayerExpandToggleClick } from "../../../../../../../actions";
import { StructReference } from "../../../../../../../../common";

type SyntheticNodeLayerOuterProps = {
  node: SyntheticNode;
  depth: number;
  dispatch: Dispatch<any>;
  hoveringReferences: StructReference<any>[];
  selectedReferences: StructReference<any>[];
};

type SyntheticNodeLayerInnerProps = {
  onLabelMouseOver: (event: React.MouseEvent<any>) => any;
  onLabelMouseOut: (event: React.MouseEvent<any>) => any;
  onLabelClick: (event: React.MouseEvent<any>) => any;
  onExpandToggleButtonClick: (event: React.MouseEvent<any>) => any;
} & SyntheticNodeLayerOuterProps;

const BaseSyntheticNodeLayerComponent = ({ onExpandToggleButtonClick, onLabelMouseOver, onLabelMouseOut, onLabelClick, hoveringReferences, selectedReferences, node, depth, dispatch }: SyntheticNodeLayerInnerProps) => {
  const labelStyle = {
    paddingLeft: 30 + depth * 8
  };

  // FIXME: this is ick, clean it up.
  const selected = selectedReferences.find(ref => ref.id === node.id);
  const hovering = hoveringReferences.find(ref => ref.id === node.id);
  const expanded = getAttribute(node, "expanded", EDITOR_NAMESPACE);

  return <div className="m-synthetic-node-layer">
    <div style={labelStyle} className={cx("label", { selected, hovering })} onMouseOver={onLabelMouseOver} onMouseOut={onLabelMouseOut} onClick={onLabelClick}>
      <span onClick={onExpandToggleButtonClick}>
        { node.children.length ? expanded ? <i className="ion-arrow-down-b" /> : <i className="ion-arrow-right-b" /> : null }
      </span>
      { getAttribute(node, "label", EDITOR_NAMESPACE) || "Untitled" }
    </div>
    <div className="children">
      {
        !node.children.length || expanded ? node.children.map(child => {
          return <SyntheticNodeLayerComponent hoveringReferences={hoveringReferences} selectedReferences={selectedReferences} key={child.id} node={child as SyntheticNode} depth={depth + 1} dispatch={dispatch} />
        }) : null
      }
    </div>
  </div>;
};
const SyntheticNodeLayerComponent = compose<SyntheticNodeLayerInnerProps, SyntheticNodeLayerOuterProps>(
  pure,
  withHandlers({
    onLabelMouseOver: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerMouseOver({ type: SyntheticObjectType.ELEMENT, id: node.id }));
    },
    onLabelMouseOut: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerMouseOut({ type: SyntheticObjectType.ELEMENT, id: node.id }));
    },
    onLabelClick: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerClick({ type: SyntheticObjectType.ELEMENT, id: node.id }));
    },
    onExpandToggleButtonClick: ({ dispatch, document, node }) => (event: React.MouseEvent<any>) => {
      dispatch(pcLayerExpandToggleClick({ type: SyntheticObjectType.ELEMENT, id: node.id }));
      event.stopPropagation();
    }
  })
)(BaseSyntheticNodeLayerComponent);

type SyntheticDocumentLayerOuterProps = {
  hoveringReferences: StructReference<any>[];
  selectedReferences: StructReference<any>[];
  dispatch: Dispatch<any>;
  document: SyntheticDocument;
}

type SyntheticDocumentLayerInnerProps = {
  onLabelMouseOver: (event: React.MouseEvent<any>) => any;
  onLabelMouseOut: (event: React.MouseEvent<any>) => any;
  onLabelClick: (event: React.MouseEvent<any>) => any;
  onExpandToggleButtonClick: (event: React.MouseEvent<any>) => any;
} & SyntheticDocumentLayerOuterProps;


const BaseSyntheticDocumentLayerComponent = ({ onLabelMouseOver, onExpandToggleButtonClick, onLabelMouseOut, onLabelClick, dispatch, document, hoveringReferences, selectedReferences }: SyntheticDocumentLayerInnerProps) => {
  const selected = selectedReferences.find(ref => ref.id === document.id);
  const hovering = hoveringReferences.find(ref => ref.id === document.id);
  const expanded = getAttribute(document.root, "expanded", EDITOR_NAMESPACE);
  return <div className="m-synthetic-document-layer">
    <div className={cx("label", { selected, hovering })} onMouseOver={onLabelMouseOver} onMouseOut={onLabelMouseOut} onClick={onLabelClick}>
      <span onClick={onExpandToggleButtonClick}>
        { document.root.children.length ? expanded ? <i className="ion-arrow-down-b" /> : <i className="ion-arrow-right-b" /> : null }
      </span>
      Component
    </div>
    <div className="children">
      {
        !document.root.children.length || expanded ? document.root.children.map(child => {
          return <SyntheticNodeLayerComponent key={child.id} hoveringReferences={hoveringReferences} selectedReferences={selectedReferences} node={child as SyntheticNode} dispatch={dispatch} depth={1} />
        }) : null
      }
    </div>
  </div>;
};

const SyntheticDocumentLayerComponent = compose<SyntheticDocumentLayerInnerProps, SyntheticDocumentLayerOuterProps>(
  pure,
  withHandlers({
    onLabelMouseOver: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerMouseOver(document));
    },
    onLabelMouseOut: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerMouseOut(document));
    },
    onLabelClick: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerClick(document));
    },
    onExpandToggleButtonClick: ({ dispatch, document, node }) => (event: React.MouseEvent<any>) => {
      dispatch(pcLayerExpandToggleClick(document));
      event.stopPropagation();
    }
  })
)(BaseSyntheticDocumentLayerComponent);

type SyntheticWindowLayersOuterProps = {
  hoveringReferences: StructReference<any>[];
  selectedReferences: StructReference<any>[];
  dispatch: Dispatch<any>;
  window: SyntheticWindow;
  browser: SyntheticBrowser;
};

type SyntheticWindowLayersInnerProps = {

} & SyntheticWindowLayersOuterProps;

const BaseSyntheticWindowLayersComponent = ({ hoveringReferences, selectedReferences, dispatch, window, browser }: SyntheticWindowLayersInnerProps) => {
  return <div className="m-synthetic-window-layers">
    {
      (window.documents || EMPTY_ARRAY).map(document => {
        return <SyntheticDocumentLayerComponent hoveringReferences={hoveringReferences} selectedReferences={selectedReferences} document={document} dispatch={dispatch} />
      })
    }
  </div>;
};

export const SyntheticWindowLayersComponent = compose<SyntheticWindowLayersInnerProps, SyntheticWindowLayersOuterProps>(
  pure
)(BaseSyntheticWindowLayersComponent);