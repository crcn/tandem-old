import React from 'react';

class TextInputComponent extends React.Component {
  onInput(event) {
    this.props.reference.setValue(event.target.value);
  }
  render() {
    // silence onChange console.error
    return <input className='input form-control mousetrap'
      onInput={this.onInput.bind(this)}
      value={this.props.reference.getValue()}
      onChange={function(){}}></input>
  }
}

export default TextInputComponent;
