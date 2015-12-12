import React from 'react';

class TextInputComponent extends React.Component {
  onInput(event) {
    this.props.reference.setValue(event.target.value);
  }
  render() {
    return <input className='input form-control' onInput={this.onInput.bind(this)} value={this.props.reference.getValue()}></input>
  }
}

export default TextInputComponent;
