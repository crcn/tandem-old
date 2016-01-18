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

    var controller = this.refs.editor.controller;
    var ref        = this.props.reference;

    function getSelectedText() {
      return controller.marker.getSelectedText();
    }

    function replaceSelection(text) {
      var p = controller.marker.position;
      ref.setValue(
        ref.getValue().substr(0, p) +
        text +
        ref.getValue().substr(p + controller.marker.length)
      );

      // controller.marker.addText(text);
      // controller.marker.setSelection(p, text.length);
    }

    var bKey = (event) => {
      if (event.metaKey) {
        return replaceSelection('<b>' + getSelectedText() + '</b>');
      }
      return false;
    }

    var iKey = (event) => {
      if (event.metaKey) {
        return replaceSelection('<i>' + getSelectedText() + '</i>');
      }
      return false;
    }

    var uKey = (event) => {
      if (event.metaKey) {
        return replaceSelection('<u>' + getSelectedText() + '</u>');
      }
      return false;
    }

    var enterKey = (event) => {
      ref.setValue(ref.getValue() + '\n');
    }

    var handlers = {
      66: bKey,
      73: iKey,
      85: uKey,
      13: enterKey
    };

    var handler = handlers[event.keyCode];
    if (handler && handler(event) !== false) {
      event.preventDefault();
    }

    // event.preventDefault();
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
