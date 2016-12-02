import * as React from "react";

export class TextInputComponent extends React.Component<{ onChange?(newValue): any, value?: any }, { currentValue }> {
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
    return <input type="text" {...(this.state.currentValue != null ? { } : { value: this.props.value })} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} />
  }
}
