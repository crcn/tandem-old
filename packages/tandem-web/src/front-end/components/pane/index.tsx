import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import * as cx from "classnames";

export type PaneComponentInnerProps = {
  header?: any;
  secondary?: boolean;
  className?: string;
  children: any;
}

const BasePaneComponent = ({header, children, className, secondary}: PaneComponentInnerProps) => <div className={cx({"m-panel": true, headerless: !header, secondary }, className)}>
  {header && <div className="header">{header}</div>}
  <div className="content">
    {children}
  </div>
</div>;

export const PaneComponent = BasePaneComponent;