import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import * as cx from "classnames";

export type PanelComponentInnerProps = {
  header?: any;
  className?: string;
  children: any;
}

const BasePanelComponent = ({header, children, className}: PanelComponentInnerProps) => <div className={cx({"m-panel": true, headerless: Boolean(header) }, className)}>
  {header && <div className="header">{header}</div>}
  <div className="content">
    {children}
  </div>
</div>;

export const PanelComponent = BasePanelComponent;