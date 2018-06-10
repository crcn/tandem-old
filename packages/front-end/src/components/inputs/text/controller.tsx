import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, withHandlers, lifecycle, withProps } from "recompose";

export const withInputHandlers = (changeOnKeyDown: boolean = true) =>
  compose(
    withHandlers({
      onKeyDown: ({ onChange, changeOnKeyDown }) => event => {
        if (!onChange) {
          return;
        }
        if (changeOnKeyDown || event.key === "Enter") {
          onChange(event.target.value || undefined);
        }
      },
      onBlur: ({ onChange }) => event => {
        if (onChange) {
          onChange(event.target.value || undefined);
        }
      }
    }),
    lifecycle({
      componentDidUpdate(props: any) {
        if (props.value !== this.props.value) {
          const input = ReactDOM.findDOMNode(
            this as any
          ) as HTMLTextAreaElement;
          if (document.activeElement !== input) {
            input.value = this.props.value == null ? "" : this.props.value;
          }
        }
      }
    })
  );

export default compose<any, any>(
  pure,
  withInputHandlers(false),
  Base => ({ value, onChange, ...rest }) => {
    return <Base {...rest} defaultValue={value} />;
  }
);
