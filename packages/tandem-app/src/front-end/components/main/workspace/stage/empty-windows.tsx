import "./empty-windows.scss";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { Dispatcher } from "aerial-common2";
import { emptyWindowsUrlAdded } from "front-end/actions";

export type EmptyWindowsPropsOuter = {
  dispatch: Dispatcher<any>;
};

export type EmptyWindowsPropsInner = {
  dispatch: Dispatcher<any>;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => any;
} & EmptyWindowsPropsOuter;

const EmptyWindowsBase = ({ onSubmit }: EmptyWindowsPropsInner) => {
  return <div className="m-empty-windows">
    <form onSubmit={onSubmit}>
      <input name="url" type="text" placeholder="URL"></input>
      <input type="submit" value="Add window"></input>
    </form>
  </div>;
}

const enhanceEmptyWindows = compose<EmptyWindowsPropsInner, EmptyWindowsPropsOuter>(
  pure,
  withHandlers({
    onSubmit: ({ dispatch }) => (event: React.SyntheticEvent<any>) => {
      dispatch(emptyWindowsUrlAdded((event.target as any).url.value));
      event.preventDefault();
    }
  })
);

export const EmptyWindows = enhanceEmptyWindows(EmptyWindowsBase);
