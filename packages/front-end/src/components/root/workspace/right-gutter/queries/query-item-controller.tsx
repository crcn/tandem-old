import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { PCQuery, PCQueryType } from "paperclip";
import { BaseQueryItemProps, QueryOptions } from "./view.pc";
import { queryLabelChanged } from "../../../../../actions";

export type Props = {
  query: PCQuery;
  dispatch: Dispatch<any>;
};

export default (Base: React.ComponentClass<BaseQueryItemProps>) =>
  class BaseQueryItemController extends React.PureComponent<Props> {
    onLabelChange = (value: string) => {
      this.props.dispatch(queryLabelChanged(this.props.query, value));
    };
    render() {
      const { onLabelChange } = this;
      const { query, dispatch, ...rest } = this.props;
      return (
        <Base
          {...rest}
          editButtonProps={{
            right: true,
            content: <QueryOptions dispatch={dispatch} query={query} />
          }}
          labelInputProps={{
            value: query.label,
            focus: !query.label,
            onChangeComplete: onLabelChange
          }}
        />
      );
    }
  };
