import "./index.scss";
import React =  require("react");

export interface IGutterComponentProps {
  className?: string;
  style?: any;
}

export class GutterComponent extends React.Component<IGutterComponentProps, any> {
  render() {
    const { className, style } = this.props;
    return <div style={style} className={["gutter", className].join(" ")}>
      { this.props.children }
    </div>
  }
}