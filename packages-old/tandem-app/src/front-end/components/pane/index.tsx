import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { pure, compose } from "recompose";

export type TOuterPaneProps = {
  title: string;
  className?: string;
  children: any;
};

export const Pane = compose<TOuterPaneProps, TOuterPaneProps>(
  pure
)(({title, children, className}) => {
  return <div className={cx({ "m-pane": true }, className)}>
    <div className="header">
      {title}
    </div>
    <div className="content">
      {children}
    </div>
  </div>;
});