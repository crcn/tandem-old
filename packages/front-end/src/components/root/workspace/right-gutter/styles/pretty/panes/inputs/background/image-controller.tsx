import * as React from "react";
import { BaseBackgroundImagePickerProps } from "./view.pc";
import { memoize } from "tandem-common";
import { CSSBackgroundType, CSSImageBackground } from "./state";
import {
  DropdownMenuOption,
  dropdownMenuOptionFromValue
} from "../../../../../../../../inputs/dropdown/controller";

export type Props = {
  value: CSSImageBackground;
  onChange?: any;
  onChangeComplete?: any;
};

const REPEAT_OPTIONS: DropdownMenuOption[] = [
  "repeat",
  "no-repeat",
  "repeat-x",
  "repeat-y"
].map(dropdownMenuOptionFromValue);

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
            options: REPEAT_OPTIONS,
            value: value.repeat,
            onChangeComplete: getChangeHandler(value, "repeat", onChange)
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
