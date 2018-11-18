import * as React from "react";
import { Dispatch } from "redux";
import { PCMediaQuery } from "paperclip";
import { BaseMediaQueriesPaneProps, MediaQueryItem } from "./view.pc";
import * as cx from "classnames";
import { addMediaQueryButtonClick } from "../../../../../actions";
export type Props = {
  dispatch: Dispatch<any>;
  globalMediaQueries: PCMediaQuery[];
};
export default (Base: React.ComponentClass<BaseMediaQueriesPaneProps>) =>
  class MediaQueriesController extends React.PureComponent<Props> {
    onAddClick = () => {
      this.props.dispatch(addMediaQueryButtonClick());
    };
    render() {
      const { onAddClick } = this;
      const { globalMediaQueries, dispatch, ...rest } = this.props;
      const items = globalMediaQueries.map(mediaQuery => {
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
          addButtonProps={{
            onClick: onAddClick
          }}
          items={items}
        />
      );
    }
  };
