import "./button.scss";
import cx = require("classnames");
import React = require("react");

export class Button extends React.Component<{ className?: string, disabled?: boolean }, any> {
  render() {

    let { className, disabled, children } = this.props;
    return <div className={cx({ button: true, disabled: disabled }, className)}>
      { children }
    </div>
  }
}