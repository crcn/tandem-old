import * as React from 'react';
import TextEditor from 'sf-front-end/components/text-editor';
import Scanner from 'sf-core/string/scanner';
// import createToken from 'saffronmon/tokenizers/create-token';
// import { SPACE, TAB, NEW_LINE, TEXT } from 'saffron-common/tokenizers/token-types';

const NEW_LINE = 1;
const TAB      = NEW_LINE + 1;
const SPACE    = TAB + 1;
const TEXT     = SPACE + 1;

var htmlTokenizer = {
  tokenize(source) {
    var scanner = new Scanner(source);

    var tokens = [];

    function addToken(search, type) {
      if (scanner.scan(search)) {
        tokens.push({ value: scanner.getCapture(), type: type });
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

class WYSIWYGEditor extends React.Component<any, any> {

  constructor() {
    super();
  }

  focus() {
    (this.refs as any).editor.focus();
  }

  select() {
    (this.refs as any).editor.select();
  }

  onKeyDown(event) {

    var controller = (this.refs as any).editor.controller;
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

    const bKey = (event): any => {
      if (event.metaKey) {
        return replaceSelection('<b>' + getSelectedText() + '</b>');
      }
      return false;
    }

    var iKey = (event): any => {
      if (event.metaKey) {
        return replaceSelection('<i>' + getSelectedText() + '</i>');
      }
      return false;
    }

    var uKey = (event): any => {
      if (event.metaKey) {
        return replaceSelection('<u>' + getSelectedText() + '</u>');
      }
      return false;
    }

    var enterKey = (event): any => {
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
    return props.reference.getValue() !== (this.refs as any).editor.source;
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
