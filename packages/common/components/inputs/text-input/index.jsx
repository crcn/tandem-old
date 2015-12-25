import React from 'react';
import TextEditorComponent from 'common/components/text-editor';

class TextInputComponent extends React.Component {
  onInput(source) {
    this.props.reference.setValue(source);
  }
  setSelection(...args) {
    this.refs.editor.setSelection(...args);
  }
  select() {
    this.setSelection(0, Infinity);
  }
  focus() {
    this.refs.editor.focus();
  }
  onFocus() {
    if (this.props.selectAllOnFocus) {
      this.setSelection(0, Infinity);
    }
  }
  render() {
    var value = this.props.reference.getValue();

    var style = {
      overflow: 'hidden',
      whiteSpace: this.props.multiline ? void 0 : 'nowrap'
    };

    return <TextEditorComponent
      ref='editor'
      {...this.props}
      source={value}
      onFocus={this.onFocus.bind(this)}
      onChange={this.onInput.bind(this)}
      data-mouse-trap={false}
      style={Object.assign(style, this.props.style || {})}
      className={['input', this.props.className].join(' ') } />
  }
}

export default TextInputComponent;
