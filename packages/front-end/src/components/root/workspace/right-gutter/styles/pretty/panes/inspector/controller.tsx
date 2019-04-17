import { BaseStyleInspectorProps } from "./view.pc";
import * as React from "react";

export type Props = {};

export default (Base: React.ComponentClass<BaseStyleInspectorProps>) => {
  return class StyleInspectorController extends React.PureComponent<Props> {
    render() {
      return <Base />;
    }
  };
};
