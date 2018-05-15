import "./index.scss";
import * as React from "react";
const { QuickSearch: BaseQuickSearch, SearchResult: BaseSearchResult } = require("./index.pc");
import { compose, pure, withHandlers, withState } from "recompose";
import { RootState } from "../../state";
import { Dispatch } from "redux";
import { quickSearchItemClicked, quickSearchBackgroundClick } from "../../actions";
import {getAttribute, flattenTreeNode, FileAttributeNames, isFile, TreeNode } from "../../../common";

type SearchResultOuterProps = {
  file: TreeNode;
  textChildren: any;
  dispatch: Dispatch<any>;
}

type SearchResultInnerProps = {

} & SearchResultOuterProps;


const SearchResult = compose<SearchResultInnerProps, SearchResultOuterProps>(
  pure,
  withHandlers({
    onClick: ({ dispatch, file }) => () => {
      dispatch(quickSearchItemClicked(file));
    }
  })
)(BaseSearchResult);

type QuickSearchOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type QuickSearchInnerProps = {
  onInputKeyDown: any;
  onBackgroundClick: any;
  filter: string;
} & QuickSearchOuterProps;

export const QuickSearchComponent = compose<QuickSearchInnerProps, QuickSearchOuterProps>(
  pure,
  withState("filter", "setFilter", null),
  withHandlers({
    onInputKeyDown: ({ setFilter }) => (event) => {
      setFilter(String(event.target.value || "").toLowerCase().trim());
    },
    onBackgroundClick: ({ dispatch }) => () => {
      dispatch(quickSearchBackgroundClick());
    }
  })
)(({ filter, root, dispatch, onInputKeyDown, onBackgroundClick }) => {

  if (!root.showQuickSearch) {
    return null;
  }

  const allFiles = flattenTreeNode(root.projectDirectory);

  const results = filter ? allFiles.filter(file => {
    return isFile(file) && getAttribute(file, FileAttributeNames.URI).toLowerCase().indexOf(filter) !== -1;
  }).map((file) => {
    return <SearchResult file={file} key={getAttribute(file, FileAttributeNames.URI)} textChildren={getAttribute(file, FileAttributeNames.URI)} dispatch={dispatch} />;
  }) : [];

  return <div className="m-quick-search">
    <div className="background" onClick={onBackgroundClick} />
    <BaseQuickSearch searchResultsChildren={results} inputProps={{onKeyUp: onInputKeyDown}} />
  </div>
});
