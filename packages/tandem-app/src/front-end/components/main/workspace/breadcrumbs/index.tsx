import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import {compose, pure, withHandlers } from "recompose";
import { weakMemo, Dispatcher } from "aerial-common2";
import { 
  SyntheticElement, 
  SyntheticBrowser, 
  SyntheticWindow, 
  SYNTHETIC_ELEMENT,
  Workspace, 
  getSyntheticNodeAncestors,
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  getSyntheticElementLabel,
} from "front-end/state";

import {
  breadcrumbItemClicked,
  breadcrumbItemMouseEnter,
  breadcrumbItemMouseLeave,
} from "front-end/actions";

export type BreadcrumbsOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export type BreadcrumbsInnerProps = {
} & BreadcrumbsOuterProps;

type BreadcrumbOuterProps = {
  selected: boolean;
  element: SyntheticElement;
  windowId: string;
  dispatch: Dispatcher<any>;  
};

type BreadcrumbInnerProps = {
  onClick: () => any;
  onMouseEnter: () => any;
  onMouseLeave: () => any;
} & BreadcrumbOuterProps;


const getBreadcrumbNodes = weakMemo((workspace: Workspace, browser: SyntheticBrowser): SyntheticElement[] => {
  if (workspace.selectionRefs.length === 0) {
    return [];
  }

  const [type, $id] = workspace.selectionRefs[workspace.selectionRefs.length - 1];

  if (type !== SYNTHETIC_ELEMENT) {
    return [];
  }

  const node = getSyntheticNodeById(browser, $id);

  // not ready yet
  if (!node) {
    return [];
  }

  const ancestors = getSyntheticNodeAncestors(node, getSyntheticNodeWindow(browser, node.$id)).filter((node) => node.$type === SYNTHETIC_ELEMENT).reverse();

  return [...ancestors, node] as SyntheticElement[];
});

const BreadcrumbBase = ({ element, onClick, selected, onMouseEnter, onMouseLeave }: BreadcrumbInnerProps) => {
  return <div className={cx("breadcrumb fill-text", { selected })} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    { getSyntheticElementLabel(element) } 
    { selected ? null : <span className="arrow">
      <i className="ion-ios-arrow-right" />
    </span> }
  </div>;
};

const enhanceBreadcrumb = compose<BreadcrumbInnerProps, BreadcrumbOuterProps>(
  pure,
  withHandlers({
    onClick: ({ dispatch, element, windowId }) => () => {
      dispatch(breadcrumbItemClicked(element.$id, windowId));
    },
    onMouseEnter: ({ dispatch, element, windowId }) => () => {
      dispatch(breadcrumbItemMouseEnter(element.$id, windowId));
    },
    onMouseLeave: ({ dispatch, element, windowId }) => () => {
      dispatch(breadcrumbItemMouseEnter(element.$id, windowId));
    }
  })
);

const Breadcrumb = enhanceBreadcrumb(BreadcrumbBase);

const BreadcrumbsBase = ({ workspace, browser, dispatch }: BreadcrumbsInnerProps) => {

  const breadcrumbNodes = getBreadcrumbNodes(workspace, browser);

  return <div className="m-html-breadcrumbs">
    {
      breadcrumbNodes.map((node, i) => {
        return <Breadcrumb key={node.$id} dispatch={dispatch} element={node as SyntheticElement} windowId={getSyntheticNodeWindow(browser, node.$id).$id} selected={i === breadcrumbNodes.length - 1} />
      })
    }
  </div>;
};

const Breadcrumbs = BreadcrumbsBase;

export { Breadcrumbs };