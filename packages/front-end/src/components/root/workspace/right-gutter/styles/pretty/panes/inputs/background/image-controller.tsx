import * as React from "react";
import { BaseBackgroundImagePickerProps } from "./view.pc";
import { ColorSwatchGroup } from "../../../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: string;
  onChange?: any;
  onChangeComplete?: any;
  swatchOptionGroups: ColorSwatchGroup[];
};

export default (Base: React.ComponentClass<BaseBackgroundImagePickerProps>) =>
  class BackgroundImagePickerController extends React.PureComponent<Props> {
    onFileUriChange = (fileUri: string) => {};
    render() {
      const { onFileUriChange } = this;
      const {
        value,
        onChange,
        onChangeComplete,
        swatchOptionGroups,
        ...rest
      } = this.props;

      return (
        <Base
          {...rest}
          fileUriPickerProps={{
            value: null,
            onChange: onFileUriChange
          }}
        />
      );
    }
  };
