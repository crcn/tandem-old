import { bannerClosed } from "../actions";
import { hydrateTdBanner, TdBannerInnerProps } from "./global.pc";
import { pure, compose, withHandlers, withState } from "recompose";
import { Dispatch } from "redux";
import { Workspace } from "front-end/state";
import * as React from "react";
import { Motion, spring } from "react-motion";

export type BannerOuterProps = {
  workspace: Workspace;
  dispatch: Dispatch<any>;
};

const SPRING_OPS = {
  stiffness: 300,
  damping: 30
};

export type BannerInnerProps = {
  onClose: () => any;
  onBannerRest: () => any;
  closeButtonClicked: boolean;
  setCloseButtonClicked: (value: boolean) => any;
} & BannerOuterProps & TdBannerInnerProps;

const enhanceWorkspaceBanner = compose<TdBannerInnerProps, BannerOuterProps>(
  pure,
  withState(`closeButtonClicked`, `setCloseButtonClicked`, null),
  withHandlers({
    onClose: ({ setCloseButtonClicked }) => () => {
      setCloseButtonClicked(true);
    },
    onBannerRest: ({ dispatch, closeButtonClicked, setCloseButtonClicked }) => () => {
      if (closeButtonClicked) {
        dispatch(bannerClosed());
        setCloseButtonClicked(false);
      }
    }
  }),
  (Base: React.ComponentClass<TdBannerInnerProps>) => ({ onClose, workspace, closeButtonClicked, onBannerRest }: BannerInnerProps) => {
    const { uncaughtError } = workspace;

    let banner;

    if (uncaughtError) {
      banner = <Base error onClose={onClose}>{uncaughtError.message}</Base>;
    }

    return <Motion defaultStyle={{top: -100}} style={{top: spring(!closeButtonClicked && banner ? 0 : -100, SPRING_OPS) }} onRest={onBannerRest}>
      {
        ({top}) => {
          return <div style={{position: "absolute", top: 0, transform: `translateY(${top}%)`, zIndex: 1024, width: `100%` }}>
            {banner}
          </div>
        }
      }
    </Motion>
    
  }
);

export const WorkspaceBanner = hydrateTdBanner(enhanceWorkspaceBanner, {});