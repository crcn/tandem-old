import React from 'react';
import TextEditor from 'common/components/text-editor';
import Scanner from 'common/tokenizers/scanner';
import createToken from 'common/tokenizers/create-token';
import { SPACE, TAB, NEW_LINE, TEXT } from 'common/tokenizers/token-types';


var htmlTokenizer = {
  tokenize(source) {
    var scanner = Scanner.create(source);

    var tokens = [];

    function addToken(search, type) {
      if (scanner.scan(search)) {
        tokens.push(createToken(scanner.getCapture(), type));
        return true;
      }
    }

    while(!scanner.hasTerminated()) {
      if (addToken(/^[\n\r]/, NEW_LINE)) continue;
      if (addToken(/^\t+/, TAB)) continue;
      if (addToken(/^\u0020+/, SPACE)) continue;
      if (addToken(/^[^\<\s\t\n\r]+/, TEXT)) continue;
      if (addToken(/^<\w+.*?\/?>/, 'startTag')) continue;
      if (addToken(/^<\/\w+.*?>/, 'endTag')) continue;
      scanner.nextChar();
    }


    return tokens;
  }
}

var tokenComponentFactory = {
  create({ token }) {
    console.log(token);
    return null;
  }
}

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
      controller.marker.addText('<br>');
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
      tokenComponentFactory={tokenComponentFactory}
      tokenizer={htmlTokenizer}
      onChange={this.onChange.bind(this)}
      onKeyDown={this.onKeyDown.bind(this)} />
  }
}

export default WYSIWYGEditor;
