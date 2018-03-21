import "./index.scss";
import * as React from "react";
import * as cx from "classnames";

export const GutterBase = ({ children, className = "" }) => <div className={cx("gutter", className)}>
  { children }
</div>;

export const Gutter = GutterBase;