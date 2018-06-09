import * as React from "react";
import * as ReactDOM from "react-dom";
import { Point } from "tandem-common";
import { compose, pure, lifecycle, withState } from "recompose";

export type PopoverOuterProps = {
  open: boolean;
  anchorRect: Point;
};

export type PopoverInnerProps = {
  setAnchorRect(rect: ClientRect);
} & PopoverOuterProps;

export default compose<PopoverInnerProps, PopoverOuterProps>(
  pure,
  withState("anchorRect", "setAnchorRect", null),
  lifecycle({
    componentWillUpdate({ open }: PopoverInnerProps) {
      if (!this.props.open && open) {
        const anchor = ReactDOM.findDOMNode(this as any);
        this.props.setAnchorRect(anchor.getBoundingClientRect());
      }
    }
  }),
  Base => ({ open, anchorRect, ...rest }: PopoverOuterProps) => {
    let overrideProps: any = {};

    if (!open) {
      overrideProps = {
        contentProps: {
          children: []
        }
      };
    } else if (anchorRect) {
      overrideProps = {
        contentProps: {
          anchorRect,
          style: {
            display: "block",
            position: "fixed"
          }
        }
      };
    }

    return <Base {...rest} {...overrideProps} />;
  }
);
