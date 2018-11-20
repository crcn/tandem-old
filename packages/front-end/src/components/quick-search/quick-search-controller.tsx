import * as React from "react";
import * as cx from "classnames";
import { EMPTY_ARRAY } from "tandem-common";
import { QuickSearch } from "../../state";
import { Dispatch } from "redux";
import { BaseQuickSearchProps } from "./view.pc";
import { SearchResult } from "./row.pc";
import { quickSearchFilterChanged } from "../../actions";

export type Props = {
  quickSearch: QuickSearch;
  dispatch: Dispatch<any>;
};

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
          <SearchResult item={quickSearchResult} key={i} dispatch={dispatch} />
        );
      });

      return (
        <Base
          searchResultsProps={{
            children: results
          }}
          variant={cx({
            noItems: results.length === 0
          })}
          quickSearchInputProps={{
            defaultValue: filter,
            onChange: onInputChange,
            focus: true
          }}
        />
      );
    }
  };
