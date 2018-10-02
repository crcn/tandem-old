import * as React from "react";
import { BaseVariantPaneProps } from "./variant.pc";

export type Props = {};

export default (Base: React.ComponentClass<BaseVariantPaneProps>) =>
  class VariantController extends React.PureComponent<Props> {
    render() {
      const { ...rest } = this.props;
      return <Base {...rest} />;
    }
  };
