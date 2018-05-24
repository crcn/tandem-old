import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";

export type PresetOption = {
  name: string;
  value: string;
};

export type PresetComponentOuterProps = {
  values: PresetOption[];
};

const BasePresetComponent = ({ values }: PresetComponentOuterProps) => {
  return (
    <div className="m-presets m-hidden">
      <div className="content">TODO</div>
    </div>
  );
};

const enhance = compose<PresetComponentOuterProps, PresetComponentOuterProps>(
  pure
);

export const PresetComponent = enhance(BasePresetComponent);
