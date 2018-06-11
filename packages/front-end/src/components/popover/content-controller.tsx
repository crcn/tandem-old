import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, lifecycle, withState, withHandlers } from "recompose";
import { portal } from "../portal/controller";
import { isEqual } from "lodash";

const calcPortalStyle = (anchorRect: ClientRect, portalRect: ClientRect) => {
  return {
    position: "absolute",
    left: Math.min(anchorRect.left, window.innerWidth - portalRect.width),
    top: Math.min(
      anchorRect.top + anchorRect.height,
      window.innerHeight - portalRect.height
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
          <span ref={setContainer}>{children}</span>
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
        portalMount.children[0].children[0].getBoundingClientRect()
      );
      setStyle(newStyle);
    }
  })
);
