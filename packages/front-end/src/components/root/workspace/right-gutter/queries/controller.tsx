import * as React from "react";
import { Dispatch } from "redux";
import { PCQuery, PCQueryType } from "paperclip";
import { BaseQueriesPaneProps, MediaQueryItem } from "./view.pc";
import * as cx from "classnames";
import { addQueryButtonClick } from "../../../../../actions";
import { DropdownMenuOption } from "../../../../inputs/dropdown/controller";
export type Props = {
  dispatch: Dispatch<any>;
  globalQueries: PCQuery[];
};

const QUERY_DROPDOWN_OPTIONS: DropdownMenuOption[] = [
  {
    label: "Screen size",
    value: PCQueryType.MEDIA
  },
  {
    label: "Variable change",
    value: PCQueryType.VARIABLE
  }
];

export default (Base: React.ComponentClass<BaseQueriesPaneProps>) =>
  class MediaQueriesController extends React.PureComponent<Props> {
    onAddQueryDropdownSelect = (value: DropdownMenuOption) => {
      this.props.dispatch(addQueryButtonClick(value.value));
    };
    render() {
      const { onAddQueryDropdownSelect } = this;
      const { globalQueries, dispatch, ...rest } = this.props;
      const items = globalQueries.map(mediaQuery => {
        return (
          <MediaQueryItem
            dispatch={dispatch}
            key={mediaQuery.id}
            mediaQuery={mediaQuery}
          />
        );
      });
      return (
        <Base
          {...rest}
          variant={cx({ hasItems: items.length > 0 })}
          addQueryDropdownProps={{
            options: QUERY_DROPDOWN_OPTIONS,
            onChangeComplete: onAddQueryDropdownSelect
          }}
          items={items}
        />
      );
    }
  };
