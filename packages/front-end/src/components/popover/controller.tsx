import * as React from "react";
import * as ReactDOM from "react-dom";
import { Bounds, shiftBounds, shiftPoint } from "tandem-common";
import { compose, pure, lifecycle, withState } from "recompose";

export type PopoverOuterProps = {
  open: boolean;
  anchorRect: Bounds;
  onEmptySpaceClick: any;
};

export type PopoverInnerProps = {
  setAnchorRect(rect: Bounds);
} & PopoverOuterProps;

export default compose<PopoverInnerProps, PopoverOuterProps>(
  pure,
  withState("anchorRect", "setAnchorRect", null),
  lifecycle<PopoverInnerProps, any>({
    componentWillUpdate({ open }: PopoverInnerProps) {
      if (!this.props.open && open) {
        const anchor: HTMLDivElement = ReactDOM.findDOMNode(this as any);
        const rect = getRealElementBounds(anchor);
        this.props.setAnchorRect(rect);
      }
    }
  }),
  Base => ({
    open,
    onEmptySpaceClick,
    anchorRect,
    ...rest
  }: PopoverOuterProps) => {
    let overrideProps: any = {};

    if (anchorRect) {
      overrideProps = {
        contentProps: {
          onEmptySpaceClick,
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

const getRealElementBounds = (element: HTMLElement) => {
  const parentIframes = [];

  let current = element;
  while (1) {
    const ownerDocument = current.ownerDocument;
    if (ownerDocument === document) {
      break;
    }
    const iframe = Array.prototype.find.call(
      ownerDocument.defaultView.parent.document.querySelectorAll("iframe"),
      (iframe: HTMLIFrameElement) => {
        return iframe.contentDocument === ownerDocument;
      }
    );

    current = iframe;
    parentIframes.push(iframe);
  }

  const offset = parentIframes.reduce(
    (point, iframe) => shiftPoint(point, iframe.getBoundingClientRect()),
    { left: 0, top: 0 }
  );

  return shiftBounds(element.getBoundingClientRect(), offset);
};
