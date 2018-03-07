import { compose, pure, lifecycle } from "recompose";
import * as React from "react";
import * as ReactDOM from "react-dom";

export type FocusProps = {
  children: any;
  focus?: boolean;
}

export class FocusComponent extends React.Component<FocusProps> {
  componentDidMount() {
    if (this.props.focus !== false) {
      this.focus();
    }
  }
  componentWillReceiveProps({ focus }: FocusProps, context) {
    if (this.props.focus !== focus && focus) {
      this.focus();
    }
  }
  focus() {
    (ReactDOM.findDOMNode(this) as HTMLInputElement).select();
  }
  render() {
    return this.props.children;
  }
}