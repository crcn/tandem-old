import "./text-editor.scss";

import * as React from "react";
import TextEditor from "../models/text-editor";
import { IActor } from "@tandem/common/actors";
import { startDrag } from "@tandem/common/utils/component";
import LineComponent from "./line";
import { BrokerBus } from "@tandem/common/busses";
import { ITokenizer } from "@tandem/common/tokenizers";
import CaretComponent from "./caret";
import { Dependencies } from "@tandem/common/dependencies";
import { stringTokenizer } from "@tandem/common/tokenizers";
import HighlightComponent from "./highlight";
import { translateAbsoluteToRelativePoint } from "@tandem/common/utils/html";

export class TextEditorComponent extends React.Component<{ onKeyDown?: Function, onFocus?: Function, onChange?: Function, onBlur?: Function, style?: Object, className?: string, source: string, dependencies: Dependencies, tokenizer: ITokenizer }, any> implements IActor {

  readonly bus: BrokerBus;
  private _timer: any;
  private _idleTimer: any;
  private _editor: TextEditor;

  constructor() {
    super();

    this.state = {
      focus : false,
      idle  : true,
      style : {}
    };

    this.bus = new BrokerBus();
    this.bus.register(this);
  }


  execute(message) {

    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.setState({ idle: false });
    }, 10);

    clearTimeout(this._idleTimer);
    this._idleTimer = setTimeout(() => {
      this.setState({ idle: true });
    }, 100);

    if (message.type === "sourceChange") {
      if (this.props.onChange) {
        this.props.onChange(message.source);
      }
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this._resetEditor(nextProps);
  }

  private _resetEditor(props) {
    this._editor.source    = props.source;
    this._editor.tokenizer = props.tokenizer || stringTokenizer;
    this._editor.style     = Object.assign({}, this._editor.style || {}, props.style);
  }

  componentDidMount() {
    const style = window.getComputedStyle((this.refs as any).editor);
    this._editor.style = Object.assign({}, this._editor.style, {
      fontSize      : style.fontSize,
      fontFamily    : style.fontFamily,
      color         : style.color,
      whiteSpace    : style.whiteSpace,
      fontWeight    : style.fontWeight,
      letterSpacing : style.letterSpacing
    });
  }

  get editor(): TextEditor {

    if (!this._editor) {
      this._editor = new TextEditor(this.bus);
      this._resetEditor(this.props);
    }

    return this._editor;
  }

  onKey(event) {
    this._editor.marker.addText(String.fromCharCode(event.which));
    event.preventDefault();
  }

  shouldComponentUpdate(props, state) {
    return this.props.source !== props.source || this.state.idle !== state.idle || this.state.focus !== state.focus;
  }

  onKeyCommand(event) {

    const editor = this._editor;

    const setPosition = (position) => {
      if (event.shiftKey) {
        const min = Math.min(position, editor.marker.position);
        const max = Math.max(position, editor.marker.endPosition);
        editor.marker.setSelection(min, max - min);
      } else {
        editor.marker.setSelection(position);
      }
    };

    const removeSelection = (event) => {

      if (event.altKey && editor.marker.length === 0) {
        const token = editor.getTokenFromPosition(editor.marker.position);

        editor.marker.setSelection(
          token.position,
          editor.marker.position - token.position
        );
      }

      editor.marker.removeSelection();
    };

    const moveDown = (event) => {
      editor.caret.moveLine(1);
    };

    const moveRight = (event: KeyboardEvent) => {

      if (event.shiftKey) {
        editor.marker.setSelection(
          editor.marker.position,
          event.shiftKey ? editor.marker.length + 1 : 1
        );
      } else {
        editor.marker.setSelection(
          editor.marker.position + 1
        );
      }
    };

    const moveUp = (event) => {
      editor.caret.moveLine(-1);
    };

    const moveLeft = (event) => {
      if (event.altKey) {
        // const token = editor.getTokenFromPosition(editor.marker.position);

      }
      editor.marker.setSelection(
        editor.marker.position - 1,
        event.shiftKey ? editor.marker.length + 1 : 0
      );
    };

    const aKey = (event: KeyboardEvent): any => {
      if (event.metaKey) return editor.marker.setSelection(0, Infinity);
      if (event.ctrlKey) return editor.caret.moveToLinePosition(0);
      return false;
    };

    const eKey = (event: KeyboardEvent): any => {
      if (event.ctrlKey) {
        editor.marker.setSelection(editor.marker.position + editor.marker.length);
        return editor.caret.moveToLinePosition(Infinity);
      }
      return false;
    };

    const kKey = (event: KeyboardEvent): any => {
      if (event.ctrlKey) return editor.caret.removeCharsUntilEndOfLine();
      return false;
    };

    const dKey = (event: KeyboardEvent): any => {
      if (event.ctrlKey) return editor.caret.removeNextCharacter();
      return false;
    };

    const handlers = {
      40 : moveDown,
      39 : moveRight,
      38 : moveUp,
      37 : moveLeft,
      65 : aKey,
      69 : eKey,
      75 : kKey,
      68 : dKey,
      8  : removeSelection
    };

    const handler = handlers[event.keyCode];

    if (handler) {
      // necessary to prevent scrolling
      if (handler(event) !== false) {
        event.preventDefault();
      }
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }


  onFocus(event) {
    this.setState({ focus: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  setSelection(start, length) {
    this.editor.marker.setSelection(start, length);
  }

  select() {
    this.setSelection(0, Infinity);
  }

  onBlur(event) {
    this.setState({ focus: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  onPaste(event) {
    this.editor.marker.addText(event.clipboardData.getData("text/plain"));
  }

  onCopy(event) {
    event.clipboardData.setData("text/plain", this.editor.marker.getSelectedText());
    event.preventDefault();
  }

  focus() {
    (this.refs as any).hiddenInput.focus();
  }

  onMouseDown(event) {
    this.focus();

    // prevent default here to ensure that the text input doesn"t blur
    // out when we interact with the text editor
    event.preventDefault();

    const startPosition = this._getSourcePositionFromMouseEvent(event);

    // shift highlight
    if (event.shiftKey) {
      this._markSelection(startPosition, this._editor.marker.position);
    } else {
      this._editor.caret.setPosition(startPosition);
    }

    startDrag(event, (event, info) => {
      const endPosition = this._getSourcePositionFromMouseEvent(event);
      this._markSelection(startPosition, endPosition);
    });
  }

  _markSelection(startPosition, endPosition) {
    if (endPosition !== startPosition) {
      const min = Math.min(endPosition, startPosition);
      const max = Math.max(endPosition, startPosition);
      this._editor.marker.setSelection(min, max - min);
    }
  }

  onDoubleClick(event) {
    const position = this._getSourcePositionFromMouseEvent(event);
    const token = this._editor.getTokenFromPosition(position);
    this._editor.marker.setSelection(token.position, token.length);
  }

  _getSourcePositionFromMouseEvent(event) {
    const { left, top } = translateAbsoluteToRelativePoint(event, (this.refs as any).editor);

    const tr = this._editor.textRuler;
    const lh = tr.calculateLineHeight();
    let i = 0;
    while ((i + 1) * lh < top) i++;

    const line = this._editor.lines[i];
    const column = tr.convertPointToCharacterPosition(line.toString(), left);

    return line.position + column;
  }

  render() {

    const editor = this.editor;

    return <div
      ref="editor"
      style={editor.style}
      data-mouse-trap={false}
      className={["m-text-editor", this.props.className].join(" ")}
      onDoubleClick={this.onDoubleClick.bind(this)}
      onMouseDown={this.onMouseDown.bind(this)}
      >

      <div className="m-text-editor--inner">

        {
          editor.lines.map((line, i) => {
            return <LineComponent editor={editor} line={line} key={i} dependencies={this.props.dependencies} />;
          })
        }

        { this.state.focus ? editor.marker.length > 0 ? <HighlightComponent marker={editor.marker} editor={editor} /> : <CaretComponent idle={this.state.idle} editor={editor} caret={editor.caret} /> : void 0 }
      </div>

      <input ref="hiddenInput" type="text"
             onKeyPress={this.onKey.bind(this)}
             onPaste={this.onPaste.bind(this)}
             onCopy={this.onCopy.bind(this)}
             onKeyDown={this.onKeyCommand.bind(this)}
             onFocus={this.onFocus.bind(this)}
             onBlur={this.onBlur.bind(this)} />
    </div>;
  }
}