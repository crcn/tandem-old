import "./selectables.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { SyntheticDocument } from "paperclip";

export type SelectableToolsOuterProps = {
  documents: SyntheticDocument[]
};

const BaseSelectableToolsComponent = ({ documents }: SelectableToolsOuterProps) => {
  if (!documents) {
    return null;
  }

  return <div className="m-selectable-tools">
  </div>;
};

const enhance = compose<SelectableToolsOuterProps, SelectableToolsOuterProps>(
  pure
);

export const SelectableToolsComponent = enhance(BaseSelectableToolsComponent);