import React =  require("React");
import { TextEditorComponent } from "../text-editor";
import { StringScanner } from "@tandem/common/string/scanner";
// import createToken from "saffronmon/tokenizers/create-token";
// import { SPACE, TAB, NEW_LINE, TEXT } from "saffron-common/tokenizers/token-types";

const NEW_LINE = 1;
const TAB      = NEW_LINE + 1;
const SPACE    = TAB + 1;
const TEXT     = SPACE + 1;

const htmlTokenizer = {
  tokenize(source) {
    const scanner = new StringScanner(source);

    const tokens = [];

    function addToken(search, type) {
      if (scanner.scan(search)) {
        tokens.push({ value: scanner.getCapture(), type: type });
        return true;
      }
    }

    while (!scanner.hasTerminated()) {
      if (addToken(/^[\n\r]/, NEW_LINE)) continue;
      if (addToken(/^\t+/, TAB)) continue;
      if (addToken(/^\u0020+/, SPACE)) continue;
      if (addToken(/^[^\<\s\t\n\r]+/, TEXT)) continue;
      if (addToken(/^<\w+.*?\/?>/, "startTag")) continue;
      if (addToken(/^<\/\w+.*?>/, "endTag")) continue;
      scanner.nextChar();
    }


    return tokens;
  }
};

const tokenComponentFactory = {
  create({ token }) {
    return null;
  }
};

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

    const controller = (this.refs as any).editor.controller;
    const ref        = this.props.reference;

    function getSelectedText() {
      return controller.marker.getSelectedText();
    }

    function replaceSelection(text) {
      const p = controller.marker.position;
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
        return replaceSelection("<b>" + getSelectedText() + "</b>");
      }
      return false;
    };

    const iKey = (event): any => {
      if (event.metaKey) {
        return replaceSelection("<i>" + getSelectedText() + "</i>");
      }
      return false;
    };

    const uKey = (event): any => {
      if (event.metaKey) {
        return replaceSelection("<u>" + getSelectedText() + "</u>");
      }
      return false;
    };

    const enterKey = (event): any => {
      controller.marker.addText("<br>");
    };

    const handlers = {
      66: bKey,
      73: iKey,
      85: uKey,
      13: enterKey
    };

    const handler = handlers[event.keyCode];
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
    const value = this.props.reference.getValue();
    return <TextEditorComponent
      ref="editor"
      {...this.props}
      value={value}
      tokenizer={htmlTokenizer}
      onChange={this.onChange.bind(this)}
      onKeyDown={this.onKeyDown.bind(this)} />;
  }
}

export default WYSIWYGEditor;
