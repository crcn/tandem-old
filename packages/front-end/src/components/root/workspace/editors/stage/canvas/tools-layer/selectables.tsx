import "./selectables.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Frame } from "paperclip";

export type SelectableToolsOuterProps = {
  frames: Frame[];
};

const BaseSelectableToolsComponent = ({
  frames
}: SelectableToolsOuterProps) => {
  if (!frames) {
    return null;
  }

  return <div className="m-selectable-tools" />;
};

const enhance = compose<SelectableToolsOuterProps, SelectableToolsOuterProps>(
  pure
);

export const SelectableToolsComponent = enhance(BaseSelectableToolsComponent);
