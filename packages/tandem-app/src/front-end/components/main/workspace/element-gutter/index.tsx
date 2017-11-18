import * as React from "react";
import { compose, pure } from "recompose";
import { Dispatcher } from "aerial-common2";
import { Gutter } from "front-end/components/enhanced";
import {CSSInspector } from "./css-inspector";
import { SyntheticBrowser, Workspace } from "front-end/state";

export type ElementGutterOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
};

export const ElementGutterBase = ({ browser, workspace, dispatch }: ElementGutterOuterProps) => <Gutter left={false} right={true}>
  <CSSInspector browser={browser} workspace={workspace} dispatch={dispatch} />
</Gutter>;

const enhanceElementGutter = compose<ElementGutterOuterProps, ElementGutterOuterProps>(
  pure
);

export const ElementGutter = enhanceElementGutter(ElementGutterBase);