import * as React from "react";
import * as cx from "classnames";
import { BaseColorSwatchesProps, ColorSwatchItem } from "./picker.pc";
import { EMPTY_ARRAY } from "tandem-common";

export const maybeConvertSwatchValueToColor = (
  value: string,
  swatchOptions: ColorSwatchOption[] = []
) => {
  const option = swatchOptions.find(option => option.value === value);
  return option ? option.color : value;
};

export type ColorSwatchOption = {
  value: string;
  color: string;
};

export type Props = {
  onChange: (value: string) => any;
  value: string;
  options: ColorSwatchOption[];
};
export default (Base: React.ComponentClass<BaseColorSwatchesProps>) =>
  class ColorSwatchesController extends React.PureComponent<Props> {
    render() {
      const {
        value: selectedValue,
        options = EMPTY_ARRAY,
        onChange,
        ...rest
      } = this.props;
      const content = options.map(({ color, value }) => {
        return (
          <ColorSwatchItem
            variant={cx({
              selected: selectedValue === value
            })}
            onClick={() => onChange(value)}
            pillProps={{
              style: {
                background: color
              }
            }}
          />
        );
      });

      return <Base {...rest} content={content} />;
    }
  };
