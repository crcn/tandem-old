import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, lifecycle, withState } from "recompose";
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
  Base => {
    return ({ anchorRect, ...rest }) => {
      return anchorRect ? <Base anchorRect={anchorRect} {...rest} /> : null;
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
