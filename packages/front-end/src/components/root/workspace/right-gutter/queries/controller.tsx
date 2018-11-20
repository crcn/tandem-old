import * as React from "react";
import { Dispatch } from "redux";
import { PCQuery, PCQueryType } from "paperclip";
import { BaseQueriesPaneProps, QueryItem } from "./view.pc";
import { addQueryButtonClick } from "../../../../../actions";
import { QUERY_DROPDOWN_OPTIONS } from "./utils";
export type Props = {
  dispatch: Dispatch<any>;
  globalQueries: PCQuery[];
};

export default (Base: React.ComponentClass<BaseQueriesPaneProps>) =>
  class MediaQueriesController extends React.PureComponent<Props> {
    onAddQueryDropdownSelect = (value: PCQueryType) => {
      this.props.dispatch(addQueryButtonClick(value));
    };
    render() {
      const { onAddQueryDropdownSelect } = this;
      const { globalQueries, dispatch, ...rest } = this.props;
      const items = globalQueries.map(query => {
        return <QueryItem dispatch={dispatch} key={query.id} query={query} />;
      });
      return (
        <Base
          {...rest}
          addQueryDropdownProps={{
            options: QUERY_DROPDOWN_OPTIONS,
            onChangeComplete: onAddQueryDropdownSelect
          }}
          items={items}
        />
      );
    }
  };
