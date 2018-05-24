import "./index.scss";
import * as React from "react";
const {
  QuickSearch: BaseQuickSearch,
  SearchResult: BaseSearchResult,
  QuickSearchInput
} = require("./index.pc");
import { compose, pure, withHandlers, withState } from "recompose";
import { RootState } from "../../state";
import { Dispatch } from "redux";
import {
  quickSearchItemClicked,
  quickSearchBackgroundClick
} from "../../actions";
import {
  getAttribute,
  flattenTreeNode,
  FileAttributeNames,
  isFile,
  TreeNode
} from "tandem-common";
import { FocusComponent } from "../focus";

type SearchResultOuterProps = {
  file: TreeNode<any, any>;
  textChildren: any;
  dispatch: Dispatch<any>;
};

type SearchResultInnerProps = {} & SearchResultOuterProps;

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
  filter: string[];
} & QuickSearchOuterProps;

export const QuickSearchComponent = compose<
  QuickSearchInnerProps,
  QuickSearchOuterProps
>(
  pure,
  withState("filter", "setFilter", null),
  withHandlers({
    onInputKeyDown: ({ setFilter }) => event => {
      setFilter(
        String(event.target.value || "")
          .toLowerCase()
          .trim()
          .split(" ")
      );
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

  const results = filter
    ? allFiles
        .filter(file => {
          if (!isFile(file)) {
            return false;
          }
          const uri = getAttribute(file, FileAttributeNames.URI);
          let lastIndex = 0;
          for (const part of filter) {
            const i = uri.indexOf(part);
            if (i < lastIndex) {
              return false;
            }
          }
          return true;
        })
        .map(file => {
          return (
            <SearchResult
              file={file}
              key={file.id}
              textChildren={getAttribute(file, FileAttributeNames.URI)}
              dispatch={dispatch}
            />
          );
        })
    : [];

  return (
    <div className="m-quick-search">
      <div className="background" onClick={onBackgroundClick} />
      <BaseQuickSearch
        searchResultsChildren={results}
        inputWrapperChildren={
          <FocusComponent>
            <QuickSearchInput onKeyUp={onInputKeyDown} />
          </FocusComponent>
        }
      />
    </div>
  );
});
