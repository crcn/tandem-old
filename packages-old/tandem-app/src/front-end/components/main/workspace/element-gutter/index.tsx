import * as React from "react";
import { compose, pure } from "recompose";
import { Dispatcher } from "aerial-common2";
import { Gutter, CSSInpectorPane } from "front-end/components/enhanced";
import {CSSInspector } from "./css-inspector";
import { Workspace } from "front-end/state";

export type ElementGutterOuterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export const ElementGutterBase = ({ workspace, dispatch }: ElementGutterOuterProps) => <Gutter left={false} right={true}>
  <CSSInpectorPane workspace={workspace} dispatch={dispatch} />
  {/* <CSSInspector browser={browser} workspace={workspace} dispatch={dispatch} /> */}
</Gutter>;

const enhanceElementGutter = compose<ElementGutterOuterProps, ElementGutterOuterProps>(
  pure
);

export const ElementGutter = enhanceElementGutter(ElementGutterBase);