import * as React from "react";
import { BaseBackgroundImagePickerProps } from "./view.pc";
import { memoize } from "tandem-common";
import { CSSBackgroundType, CSSImageBackground } from "./state";

export type Props = {
  value: CSSImageBackground;
  onChange?: any;
  onChangeComplete?: any;
};

export default (Base: React.ComponentClass<BaseBackgroundImagePickerProps>) =>
  class BackgroundImagePickerController extends React.PureComponent<Props> {
    render() {
      const { value, onChange, onChangeComplete, ...rest } = this.props;

      return (
        <Base
          {...rest}
          fileUriPickerProps={{
            value: value.uri,
            onChange: getChangeHandler(value, "uri", onChange)
          }}
          repeatInputProps={{
            value: value.repeat,
            onChangeComplete: getChangeHandler(value, "repeat", onChange)
          }}
          positionInputProps={{
            value: value.position,
            onChangeComplete: getChangeHandler(value, "position", onChange)
          }}
          sizeInputProps={{
            value: value.size,
            onChangeComplete: getChangeHandler(value, "size", onChange)
          }}
        />
      );
    }
  };

const getChangeHandler = memoize(
  (image: any, property: string, callback: any) => value => {
    callback({
      ...image,
      type: CSSBackgroundType.IMAGE,
      [property]: value
    });
  }
);
