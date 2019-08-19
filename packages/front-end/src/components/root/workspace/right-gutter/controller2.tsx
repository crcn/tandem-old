import { RightGutter2, BaseRightGutter2Props } from "./view2.pc";
import * as React from "react";

export type Props = {};

export default (Base: React.ComponentClass<BaseRightGutter2Props>) => {
  return class RightGutter2Controller extends React.Component<Props> {
    render() {
      return <Base stylesSectionProps={{}} />;
    }
  };
};
