import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import {
  quickSearchItemClicked,
  quickSearchResultItemSplitButtonClick
} from "../../actions";
import { File, memoize } from "tandem-common";
import { BaseSearchResultProps } from "./row.pc";
import { BaseQuickSearchResult, QuickSearchResult } from "../../state";

export type Props = {
  item: QuickSearchResult;
  dispatch: Dispatch<any>;
};

export default (Base: React.ComponentClass<BaseSearchResultProps>) =>
  class SearchResultController extends React.PureComponent<Props> {
    onClick = () => {
      this.props.dispatch(quickSearchItemClicked(this.props.item));
    };
    onSplitButtonClick = () => {
      this.props.dispatch(
        quickSearchResultItemSplitButtonClick(this.props.item)
      );
    };
    render() {
      const { item, ...rest } = this.props;
      const { onClick, onSplitButtonClick } = this;

      return (
        <Base
          {...rest}
          splitTabButtonProps={{
            onClick: onSplitButtonClick
          }}
          onClick={onClick}
          labelProps={{ text: item.label }}
          descriptionProps={{ text: item.description }}
        />
      );
    }
  };
