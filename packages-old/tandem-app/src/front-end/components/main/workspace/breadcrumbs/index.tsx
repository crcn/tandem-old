import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import {compose, pure, withHandlers } from "recompose";
import { weakMemo, Dispatcher } from "aerial-common2";
import { 
  Workspace, 
  getNodeArtboard,
} from "front-end/state";
import { getNodeAncestors, SlimVMObjectType, getNestedObjectById, SlimElement, getElementLabel } from "slim-dom";

import {
  breadcrumbItemClicked,
  breadcrumbItemMouseEnter,
  breadcrumbItemMouseLeave,
} from "front-end/actions";

export type BreadcrumbsOuterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export type BreadcrumbsInnerProps = {
} & BreadcrumbsOuterProps;

type BreadcrumbOuterProps = {
  selected: boolean;
  artboardId: string;
  element: SlimElement;
  dispatch: Dispatcher<any>;  
};

type BreadcrumbInnerProps = {
  onClick: () => any;
  onMouseEnter: () => any;
  onMouseLeave: () => any;
} & BreadcrumbOuterProps;


const getBreadcrumbNodes = weakMemo((workspace: Workspace): SlimElement[] => {
  if (workspace.selectionRefs.length === 0) {
    return [];
  }

  const [type, $id] = workspace.selectionRefs[workspace.selectionRefs.length - 1];

  if (type !== SlimVMObjectType.ELEMENT) {
    return [];
  }

  const artboard = getNodeArtboard($id, workspace);

  if (!artboard) {
    return [];
  }

  const node = getNestedObjectById($id, artboard.document);

  // not ready yet
  if (!node) {
    return [];
  }

  const ancestors = getNodeAncestors(node, artboard.document).filter((node) => node.type === SlimVMObjectType.ELEMENT).reverse();

  return [...ancestors, node].filter(node => node.type === SlimVMObjectType.ELEMENT) as SlimElement[];
});

const BreadcrumbBase = ({ element, onClick, selected, onMouseEnter, onMouseLeave }: BreadcrumbInnerProps) => {
  return <div className={cx("breadcrumb fill-text", { selected })} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    { getElementLabel(element) } 
    { selected ? null : <span className="arrow">
      <i className="ion-ios-arrow-right" />
    </span> }
  </div>;
};

const enhanceBreadcrumb = compose<BreadcrumbInnerProps, BreadcrumbOuterProps>(
  pure,
  withHandlers({
    onClick: ({ dispatch, element, artboardId }: BreadcrumbOuterProps) => () => {
      dispatch(breadcrumbItemClicked(element.id, artboardId));
    },
    onMouseEnter: ({ dispatch, element, artboardId }: BreadcrumbOuterProps) => () => {
      dispatch(breadcrumbItemMouseEnter(element.id, artboardId));
    },
    onMouseLeave: ({ dispatch, element, artboardId }: BreadcrumbOuterProps) => () => {
      dispatch(breadcrumbItemMouseEnter(element.id, artboardId));
    }
  })
);

const Breadcrumb = enhanceBreadcrumb(BreadcrumbBase);

const BreadcrumbsBase = ({ workspace, dispatch }: BreadcrumbsInnerProps) => {
  
  const breadcrumbNodes = getBreadcrumbNodes(workspace);

  return <div className="m-html-breadcrumbs">
    {
      breadcrumbNodes.map((node, i) => {
        return <Breadcrumb key={node.id} dispatch={dispatch} element={node as SlimElement} artboardId={getNodeArtboard(node.id, workspace).$id} selected={i === breadcrumbNodes.length - 1} />
      })
    }
  </div>;
};

const Breadcrumbs = BreadcrumbsBase;

export { Breadcrumbs };