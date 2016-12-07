import "./index.scss";

import React =  require("react");
import cx =  require("classnames");

export interface IRadioGroupComponentOption {
  value: any;
  label: string;
}

export interface IRadioGroupComponentProps {
  options: IRadioGroupComponentOption[];
  value?: any;
  className?: string;
  optionClassName?: string;
  renderOption?: (IRadioGroupComponentOption) => any;
  onChange?: (option: IRadioGroupComponentOption) => any;
}

export class RadioGroupComponent extends React.Component<IRadioGroupComponentProps, any> {
  onOptionClick = (option: IRadioGroupComponentOption) => {
    this.props.onChange(option);
  }
  render() {

    const { optionClassName, className, options, renderOption, value } = this.props;
    const classNames = [cx({ "radio-group": true }), className].join(" ");
    
    return <ul className={classNames}>
      {options.map((option) => {
        return <li key={option.label} onClick={this.onOptionClick.bind(this, option)} className={[cx({ selected: option.value === value }), optionClassName].join(" ")}>
          { renderOption ? renderOption(option) : option.label }
        </li>
      })}
    </ul>
  }
} 