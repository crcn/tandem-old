import * as React from "react";
import * as cx from "classnames";
import { BaseColorSwatchesProps, ColorSwatchItem } from "./picker.pc";
import { EMPTY_ARRAY, memoize } from "tandem-common";
import { DropdownMenuOption } from "../dropdown/controller";

export const maybeConvertSwatchValueToColor = (
  value: string,
  swatchOptionGroups: ColorSwatchGroup[] = []
) => {
  for (const group of swatchOptionGroups) {
    const option = group.options.find(option => option.value === value);
    if (option) {
      return option.color;
    }
  }
  return value;
};

export type ColorSwatchGroup = {
  label: string;
  options: ColorSwatchOption[];
};

export type ColorSwatchOption = {
  value: string;
  color: string;
};

export const mapValueToColorSwatch = (value: string): ColorSwatchOption => ({
  value,
  color: value
});

export const getColorSwatchOptionsFromValues = memoize((value: string[]) =>
  value.map(mapValueToColorSwatch)
);

export type Props = {
  onChange: (value: string) => any;
  value: string;
  optionGroups: ColorSwatchGroup[];
};

export type State = {
  selectedGroupIndex: number;
};

export default (Base: React.ComponentClass<BaseColorSwatchesProps>) =>
  class ColorSwatchesController extends React.PureComponent<Props, State> {
    state = {
      selectedGroupIndex: 0
    };
    onGroupChange = (group: ColorSwatchGroup) => {
      this.setState({
        ...this.state,
        selectedGroupIndex: this.props.optionGroups.indexOf(group)
      });
    };
    render() {
      const {
        value: selectedValue,
        optionGroups = EMPTY_ARRAY,
        onChange,
        ...rest
      } = this.props;
      const { onGroupChange } = this;
      const { selectedGroupIndex } = this.state;

      if (!optionGroups.length) {
        return null;
      }

      const selectedGroup =
        optionGroups[Math.min(selectedGroupIndex, optionGroups.length - 1)];

      const content = selectedGroup.options.map(({ color, value }) => {
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

      return (
        <Base
          {...rest}
          swatchSourceInputProps={{
            value: selectedGroup,
            options: mapColorSwatchGroupsToDropdownOptions(optionGroups),
            onChangeComplete: onGroupChange
          }}
          content={content}
        />
      );
    }
  };

const mapColorSwatchGroupsToDropdownOptions = memoize(
  (groups: ColorSwatchGroup[]): DropdownMenuOption[] => {
    return groups.map(group => ({
      label: group.label,
      value: group
    }));
  }
);
