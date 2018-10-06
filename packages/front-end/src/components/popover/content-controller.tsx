import * as React from "react";
import { compose, pure, withState } from "recompose";
import { portal } from "../portal/controller";
import { Bounds, mergeBounds, getBoundsSize } from "tandem-common";
import { BaseContentProps } from "./view.pc";

const calcPortalStyle = (anchorRect: Bounds, portalRect: Bounds) => {
  const portalSize = getBoundsSize(portalRect);
  const anchorSize = getBoundsSize(anchorRect);
  return {
    position: "absolute",
    zIndex: 1024,
    left: Math.min(anchorRect.left, window.innerWidth - portalSize.width),
    top: Math.min(
      anchorRect.top + anchorSize.height,
      window.innerHeight - portalSize.height
    )
  };
};

// ick, but okay for now. Will need to change
// when tests are added
let _popoverCount = 0;

export type Props = {
  onShouldClose: any;
  anchorRect: Bounds;
  children?: any;
} & BaseContentProps;

export default compose<any, Props>(
  (Base: React.ComponentClass<any>) => {
    return class extends React.Component<any, any> {
      private _emptySpaceListener: any;
      private _scrollListener: any;
      private _popoverIndex: number;
      setContainer = (container: HTMLDivElement) => {
        const { onShouldClose } = this.props;
        if (this._emptySpaceListener) {
          if (this._popoverIndex) {
            _popoverCount--;
          }
          document.body.removeEventListener(
            "mousedown",
            this._emptySpaceListener
          );
          document.removeEventListener("scroll", this._scrollListener, true);
        }
        if (container && onShouldClose) {
          // note that we keep track of how many popovers there are currently in the root in case any pop over
          // opens a separate popover -- in this case the user will need to click multiple times in order to close
          // all popovers
          this._popoverIndex = ++_popoverCount;
          document.body.addEventListener(
            "mousedown",
            (this._emptySpaceListener = event => {
              if (
                !container.contains(event.target) &&
                _popoverCount === this._popoverIndex
              ) {
                // beat onClick handler for dropdown button
                setImmediate(() => {
                  onShouldClose(event);
                });
              }
            })
          );

          document.addEventListener(
            "scroll",
            (this._scrollListener = event => {
              if (!container.contains(event.target)) {
                onShouldClose(event);
              }
            }),
            true
          );
        }
      };
      render() {
        const { anchorRect, children, setContainer, ...rest } = this.props;
        return anchorRect ? (
          <Base anchorRect={anchorRect} {...rest}>
            <div
              ref={this.setContainer}
              style={{ width: anchorRect.right - anchorRect.left }}
            >
              {children}
            </div>
          </Base>
        ) : null;
      }
    };
  },
  pure,
  withState(`style`, `setStyle`, null),
  portal({
    didMount: ({ anchorRect, setStyle }) => portalMount => {
      if (
        !portalMount ||
        !portalMount.children[0] ||
        !portalMount.children[0].children[0]
      ) {
        return;
      }
      const newStyle = calcPortalStyle(
        anchorRect,
        calcInnerBounds(portalMount.children[0].children[0]
          .children[0] as HTMLElement)
      );
      setStyle(newStyle);
    }
  })
);

const calcInnerBounds = (
  element: HTMLElement,
  maxDepth: number = 0,
  depth: number = 0
): Bounds => {
  const rect: ClientRect = element.getBoundingClientRect();
  if (depth >= maxDepth) return rect;
  return mergeBounds(
    ...Array.from(element.children).reduce(
      (rects, child: HTMLElement) => {
        return [...rects, calcInnerBounds(child)];
      },
      [rect]
    )
  );
};
