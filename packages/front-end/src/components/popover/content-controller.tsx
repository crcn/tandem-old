import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, lifecycle, withState, withHandlers } from "recompose";
import { portal } from "../portal/controller";
import { isEqual } from "lodash";
import { Bounds, mergeBounds, getBoundsSize } from "tandem-common";

const calcPortalStyle = (anchorRect: Bounds, portalRect: Bounds) => {
  const portalSize = getBoundsSize(portalRect);
  const anchorSize = getBoundsSize(anchorRect);
  return {
    position: "absolute",
    left: Math.min(anchorRect.left, window.innerWidth - portalSize.width),
    top: Math.min(
      anchorRect.top + anchorSize.height,
      window.innerHeight - portalSize.height
    )
  };
};

export default compose(
  withHandlers(() => {
    let _container: HTMLSpanElement;
    let _emptySpaceListener: any;
    return {
      setContainer: ({ onEmptySpaceClick }) => container => {
        if (_emptySpaceListener) {
          document.body.removeEventListener("click", _emptySpaceListener);
        }
        _container = container;
        if (container && onEmptySpaceClick) {
          document.body.addEventListener(
            "click",
            (_emptySpaceListener = event => {
              if (!container.contains(event.target)) {
                onEmptySpaceClick(event);
              }
            })
          );
        }
      }
    };
  }),
  Base => {
    return ({ setContainer, children, anchorRect, ...rest }) => {
      return anchorRect ? (
        <Base anchorRect={anchorRect} {...rest}>
          <div
            ref={setContainer}
            style={{ width: anchorRect.right - anchorRect.left }}
          >
            {children}
          </div>
        </Base>
      ) : null;
    };
  },
  pure,
  withState(`style`, `setStyle`, null),
  portal({
    didMount: ({ anchorRect, setStyle }) => portalMount => {
      const newStyle = calcPortalStyle(
        anchorRect,
        calcInnerBounds(portalMount.children[0].children[0] as HTMLElement)
      );
      setStyle(newStyle);
    }
  })
);

const calcInnerBounds = (
  element: HTMLElement,
  maxDepth: number = 3,
  depth: number = 0
): Bounds => {
  const rect: ClientRect = element.getBoundingClientRect();
  if (depth > maxDepth) return rect;
  return mergeBounds(
    ...Array.from(element.children).reduce(
      (rects, child: HTMLElement) => {
        return [...rects, calcInnerBounds(child)];
      },
      [rect]
    )
  );
};
