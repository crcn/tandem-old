import "./artboard.scss";
const VOID_ELEMENTS = require("void-elements");
import * as React from "react";
import { findDOMNode } from "react-dom";
import { Motion, spring } from "react-motion";
import { weakMemo, Dispatcher, Bounds, BaseEvent, calculateAbsoluteBounds, shiftBounds} from "aerial-common2";
import { lifecycle, compose, withState, pure, onlyUpdateForKeys, withHandlers } from "recompose";
import { canvasMotionRested, artboardMounted } from "front-end/actions";
import { Artboard as ArtboardState } from "front-end/state";
import { Isolate } from "front-end/components/isolated";

const stiffSpring = (amount: number) => spring(amount, { stiffness: 330, damping: 30 });

export type ArtboardsOuterProps = {
  dispatch: Dispatcher<any>;
};

export type ArtboardsInnerProps = ArtboardsOuterProps;

type ArtboardProps = {
  fullScreenArtboardId: string;
  artboard: ArtboardState;
  dispatch: Dispatcher<any>;
  smooth: boolean;
};

type ArtboardMountOuterProps = {
  mount: HTMLElement;
  artboardId: string;
  dispatch: any;
}

type ArtboardMountInnerProps = {
  setContainer(element: HTMLElement);
  mount: HTMLElement;
  container: HTMLElement;
} & ArtboardMountOuterProps;

const ArtboardMountBase = ({ setContainer }: ArtboardMountInnerProps) => {
  return <div ref={setContainer} />;
}

const enhanceArtboardMount = compose<ArtboardMountInnerProps, ArtboardMountOuterProps>(
  pure,
  withState("container", "setContainer", null),
  lifecycle({
    shouldComponentUpdate(props: ArtboardMountInnerProps) {
      return this.props.mount !== props.mount || this.props.container !== props.container;
    },
    componentDidUpdate() {
      const { dispatch, container, mount, artboardId } = this.props as ArtboardMountInnerProps;
      if (container && mount) {
        if (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(mount);
        dispatch(artboardMounted(artboardId));
        // TODO - dispatch mounted here
      }
    }
  })
);

const ArtboardMount = enhanceArtboardMount(ArtboardMountBase);

const ArtboardBase = ({ artboard, fullScreenArtboardId, dispatch, smooth }: ArtboardProps) => {
  const { bounds, document } = artboard;
  
  const style = {
    left: bounds.left,
    top: bounds.top,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
  };

  const defaultStyle = {
    // default to white since window background colors
    // are white too (CC)
    background: "white",
    display: fullScreenArtboardId && artboard.$id !== fullScreenArtboardId ? "none" : undefined
  };

  const smoothStyle = smooth ? {
    left: stiffSpring(style.left),
    top: stiffSpring(style.top),
    width: stiffSpring(style.width),
    height: stiffSpring(style.height)
  } : style;

  return <Motion defaultStyle={style} style={smoothStyle} onRest={() => dispatch(canvasMotionRested())}>
    {
      style => {
        return <div className="preview-artboard-component" style={{...style, ...defaultStyle}}>
          <ArtboardMount artboardId={artboard.$id} mount={artboard.mount} dispatch={dispatch} />
        </div>;
      }
    }
  </Motion>;
};

export const Artboard = pure(ArtboardBase as any) as typeof ArtboardBase;


export const Preview = () => <div>PREVIEW!</div>;