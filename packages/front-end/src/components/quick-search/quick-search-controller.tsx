import * as React from "react";
import {
  flattenTreeNode,
  File,
  isFile,
  memoize,
  EMPTY_ARRAY
} from "tandem-common";
import { RootState, QuickSearch } from "../../state";
import { Dispatch } from "redux";
import { BaseQuickSearchProps } from "./view.pc";
import { SearchResult } from "./row.pc";
import { quickSearchFilterChanged } from "../../actions";

export type Props = {
  quickSearch: QuickSearch;
  dispatch: Dispatch<any>;
};

const MAX_RESULTS = 50;

const getFilterTester = memoize(
  (filter: string[]) => new RegExp(filter.join(".*?"))
);

export default (Base: React.ComponentClass<BaseQuickSearchProps>) =>
  class QuickSearchController extends React.PureComponent<Props> {
    onInputChange = value => {
      this.props.dispatch(
        quickSearchFilterChanged(
          String(value || "")
            .toLowerCase()
            .trim()
        )
      );
    };
    render() {
      const { quickSearch, dispatch } = this.props;
      const { onInputChange } = this;

      const matches = (quickSearch && quickSearch.matches) || EMPTY_ARRAY;
      const filter = quickSearch && quickSearch.filter;

      const results = matches.map((quickSearchResult, i) => {
        return (
          <SearchResult
            filter={filter}
            item={quickSearchResult}
            key={i}
            textProps={{
              value: quickSearchResult.label
            }}
            dispatch={dispatch}
          />
        );
      });

      return (
        <Base
          searchResultsProps={{
            children: results
          }}
          quickSearchInputProps={{
            defaultValue: filter,
            onChange: onInputChange,
            focus: true
          }}
        />
      );
    }
  };
