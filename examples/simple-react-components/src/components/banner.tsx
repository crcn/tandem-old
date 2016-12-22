import "./banner.scss";
import cx = require("classnames");
import React = require("react");

export class Banner extends React.Component<{ className?: string }, any> {
  render() {
    let { children, className } = this.props;
    return <div className={cx({ banner: true }, className)}>
      { children }
    </div>
  }
}