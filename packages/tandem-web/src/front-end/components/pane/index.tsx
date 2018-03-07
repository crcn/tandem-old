import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import * as cx from "classnames";

export type PaneComponentInnerProps = {
  header?: any;
  className?: string;
  children: any;
}

const BasePaneComponent = ({header, children, className}: PaneComponentInnerProps) => <div className={cx({"m-panel": true, headerless: !header }, className)}>
  {header && <div className="header">{header}</div>}
  <div className="content">
    {children}
  </div>
</div>;

export const PaneComponent = BasePaneComponent;