import React from 'react';
import TextEditor from 'common/components/text-editor';

class WYSIWYGEditor extends React.Component {

  constructor() {
    super();
  }

  focus() {
    this.refs.editor.focus();
  }

  select() {
    this.refs.editor.select();
  }

  onKeyDown(event) {
    var bKey = (event) => {
      if (event.metaKey) {
        return;
      }
      return false;
    }

    var iKey = (event) => {
      if (event.metaKey) {
        console.log('ITALIC');
      }
      return false;
    }

    var uKey = (event) => {
      console.log(event.metaKey);
      return false;
    }

    var handlers = {
      66: bKey,
      73: iKey,
      85: uKey
    }

    console.log(event.keyCode);

    var handler = handlers[event.keyCode];
    if (handler && handler(event) !== false) {
      event.preventDefault();
    }
  }

  onChange(source) {
    this.props.reference.setValue(source);
  }

  shouldComponentUpdate(props) {
    return props.reference.getValue() !== this.refs.editor.source;
  }

  render() {
    var value = this.props.reference.getValue();
    return <TextEditor
      ref='editor'
      {...this.props}
      source={value}
      onChange={this.onChange.bind(this)}
      onKeyDown={this.onKeyDown.bind(this)} />
  }
}

export default WYSIWYGEditor;
