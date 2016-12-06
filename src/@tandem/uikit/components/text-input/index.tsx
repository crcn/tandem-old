import React =  require("React");

export class TextInputComponent extends React.Component<{ onChange?(newValue): any, value?: any, placeholder?: string, rows?: number }, { currentValue }> {
  state = {
    currentValue: undefined
  }
  onChange = (event: React.KeyboardEvent<any>) => {
    if (this.props.onChange) this.props.onChange(this.state.currentValue = event.currentTarget.value);
  }
  onFocus = (event: React.FocusEvent<any>) => {
    this.setState({ currentValue: event.currentTarget.value });
  }
  onBlur = () => {
    this.setState({ currentValue: undefined });
  }
  render() {
    const props = {
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      placeholder: this.props.placeholder,
      rows: this.props.rows
    } as any;

    if (this.state.currentValue == null && this.props.value != null) {
      props.value = this.props.value;
    }

    if (props.rows) {
      return <textarea {...props} />
    }

    return <input type="text" {...props} />;
  }
}
