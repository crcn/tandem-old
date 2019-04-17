import { BaseStyleInspectorProps, Declaration } from "./view.pc";
import * as React from "react";
import { ComputedStyleInfo } from "paperclip";

export type Props = {
  computedStyleInfo: ComputedStyleInfo;
};

export default (Base: React.ComponentClass<BaseStyleInspectorProps>) => {
  return class StyleInspectorController extends React.PureComponent<Props> {
    render() {
      const { computedStyleInfo } = this.props;

      const declarations = Object.keys(computedStyleInfo.style).map(
        styleName => {
          return (
            <Declaration
              name={styleName}
              value={computedStyleInfo.style[styleName]}
            />
          );
        }
      );
      return <Base declarations={declarations} />;
    }
  };
};
