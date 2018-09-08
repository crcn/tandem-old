import * as React from "react";
import { stringifyStyle, EMPTY_OBJECT } from "tandem-common";
import { rawCssTextChanged } from "../../../../../../../actions";
import { BaseCodeProps } from "./code.pc";
import { Dispatch } from "redux";
import { SyntheticElement } from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
};

export type InnerProps = {
  onChange: any;
} & Props;

export default (Base: React.ComponentClass<BaseCodeProps>) =>
  class CodeController extends React.PureComponent<Props> {
    onChange = value => {
      this.props.dispatch(rawCssTextChanged(value));
    };

    render() {
      const { onChange } = this;
      const { selectedNodes, ...rest } = this.props;
      const cssText = getSelectedNodeStyle(selectedNodes);
      return (
        <Base
          {...rest}
          textareaProps={{
            value: cssText,
            onChange
          }}
        />
      );
    }
  };

const getSelectedNodeStyle = selectedNodes => {
  const node = selectedNodes[0];
  return (
    node &&
    stringifyStyle(node.style || EMPTY_OBJECT)
      .split(";")
      .join(";\n")
  );
};
