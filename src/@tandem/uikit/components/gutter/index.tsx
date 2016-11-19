import "./index.scss";
import * as React from "react";

export interface IGutterComponentProps {
  className?: string;
}

export class GutterComponent extends React.Component<IGutterComponentProps, any> {
  render() {
    const { className } = this.props;
    return <div className={["gutter", className].join(" ")}>
      { this.props.children }
    </div>
  }
}