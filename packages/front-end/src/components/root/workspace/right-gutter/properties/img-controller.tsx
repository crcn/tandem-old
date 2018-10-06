import * as React from "react";
import { PCNode, InspectorNode } from "paperclip";
import { BaseBackgroundImageInputProps } from "../styles/pretty/panes/backgrounds.pc";

export type Props = {
  selectedInspectorNode: InspectorNode;
} & BaseBackgroundImageInputProps;

export default (Base: React.ComponentClass<BaseBackgroundImageInputProps>) =>
  class ImgPropertyController extends React.PureComponent<Props> {
    render() {
      const { selectedInspectorNode, ...rest } = this.props;
      return <Base {...rest} />;
    }
  };
