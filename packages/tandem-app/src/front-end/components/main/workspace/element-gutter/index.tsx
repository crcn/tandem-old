import * as React from "react";
import { compose, pure } from "recompose";
import { Gutter } from "front-end/components/gutter";
import {CSSInspector } from "./css-inspector";
import { SyntheticBrowser, Workspace } from "front-end/state";

export type ElementGutterOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
};

export const ElementGutterBase = ({ browser, workspace }: ElementGutterOuterProps) => <Gutter>
  <CSSInspector browser={browser} workspace={workspace} />
</Gutter>;

const enhanceElementGutter = compose<ElementGutterOuterProps, ElementGutterOuterProps>(
  pure
);

export const ElementGutter = enhanceElementGutter(ElementGutterBase);