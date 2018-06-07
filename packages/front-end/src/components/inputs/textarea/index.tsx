import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, withHandlers, lifecycle } from "recompose";

export default compose<any, any>(
  pure,
  lifecycle({
    componentDidUpdate(props: any) {
      if (props.value !== this.props.value) {
        const input = ReactDOM.findDOMNode(this as any) as HTMLTextAreaElement;
        if (document.activeElement !== input) {
          input.value = this.props.value;
        }
      }
    }
  }),
  Base => ({ value, onChange }) => {
    return <Base defaultValue={value} onChange={onChange} />;
  }
);
