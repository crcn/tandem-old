import * as React from "react";
import { Dispatch } from "redux";
import { PCQuery, PCQueryType } from "paperclip";
import { BaseQueriesPaneProps, QueryItem } from "./view.pc";
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
