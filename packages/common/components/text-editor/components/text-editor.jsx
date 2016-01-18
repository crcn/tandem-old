import './text-editor.scss';

import React from 'react';
import TextEditor from '../controllers/text-editor';
import { startDrag } from 'common/utils/component';
import TypeNotifier from 'common/notifiers/type';
import LineComponent from './line';
import CaretComponent from './caret';
import CollectionNotifier from 'common/notifiers/collection';
import HighlightComponent from './highlight';
import { translateAbsoluteToRelativePoint } from 'common/utils/html';

class TextEditorComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      focus : false,
      idle  : true,
      style : {}
    };

    this.notifier = CollectionNotifier.create();
    this.notifier.push(this);
  }

  notify(message) {

    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.setState({ idle: false });
    }, 10);

    clearTimeout(this._idleTimer);
    this._idleTimer = setTimeout(() => {
      this.setState({ idle: true });
    }, 100);

    if (message.type === 'sourceChange') {
      if (this.props.onChange) {
        this.props.onChange(message.source);
      }
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.getEditor().setProperties({
      ...nextState,
      ...nextProps
    });
  }

  componentDidMount() {
    var style = window.getComputedStyle(this.refs.editor);
    this.setState({
      style: {
        fontSize      : style.fontSize,
        color         : style.color,
        whiteSpace    : style.whiteSpace,
        letterSpacing : style.letterSpacing
      }
    });
  }

  getEditor(props) {
    if (this._editor) {
      if (props) this._editor.setProperties(props);
      return this._editor;
    }

    this._editor = TextEditor.create({
      notifier: this.notifier,
      ...props
    });

    return this._editor;
  }

  onKey(event) {
    this._editor.marker.addText(String.fromCharCode(event.which));
    event.preventDefault();
  }

  select() {
    this._editor.marker.setSelection(0, Infinity);
  }

  get controller() {
    return this.getEditor();
  }

  onKeyCommand(event) {

    var editor = this._editor;

    var setPosition = (position) => {
      if (event.shiftKey) {
        var min = Math.min(position, editor.marker.position);
        var max = Math.max(position, editor.marker.endPosition);
        editor.marker.setSelection(min, max - min);
      } else {
        editor.marker.setSelection(position);
      }
    };

    var removeSelection = (event) => {
      editor.marker.removeSelection();
    };

    var moveDown = (event) => {
      editor.caret.moveLine(1);
    };

    var moveRight = (event) => {
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

    var moveUp = (event) => {
      editor.caret.moveLine(-1);
    };

    var moveLeft = (event) => {
      editor.marker.setSelection(
        editor.marker.position - 1,
        event.shiftKey ? editor.marker.length + 1 : 0
      );
    };

    var aKey = (event) => {
      if (event.metaKey) return editor.marker.setSelection(0, Infinity);
      if (event.ctrlKey) return editor.caret.moveToLinePosition(0);
      return false;
    }

    var eKey = (event) => {
      if (event.ctrlKey) {
        editor.marker.setSelection(editor.marker.position + editor.marker.length);
        return editor.caret.moveToLinePosition(Infinity);
      }
      return false;
    }

    var kKey = (event) => {
      if (event.ctrlKey) return editor.caret.removeCharsUntilEndOfLine();
      return false;
    }

    var dKey = (event) => {
      if (event.ctrlKey) return editor.caret.removeNextCharacter();
      return false;
    }

    var handlers = {
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

    var handler = handlers[event.keyCode];

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
    this.getEditor().marker.setSelection(start, length);
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
    this.getEditor().marker.addText(event.clipboardData.getData('text/plain'));
  }

  onCopy(event) {
    event.clipboardData.setData('text/plain', this.controller.marker.getSelectedText());
    event.preventDefault();
  }

  focus() {
    this.refs.hiddenInput.focus();
  }

  onMouseDown(event) {
    this.focus();

    // prevent default here to ensure that the text input doesn't blur
    // out when we interact with the text editor
    event.preventDefault();

    var startPosition = this._getSourcePositionFromMouseEvent(event);

    // shift highlight
    if (event.shiftKey) {
      this._markSelection(startPosition, this._editor.marker.position);
    } else {
      this._editor.caret.setPosition(startPosition);
    }

    startDrag(event, (event, info) => {
      var endPosition = this._getSourcePositionFromMouseEvent(event);
      this._markSelection(startPosition, endPosition);
    });
  }

  _markSelection(startPosition, endPosition) {
    if (endPosition !== startPosition) {
      var min = Math.min(endPosition, startPosition);
      var max = Math.max(endPosition, startPosition);
      this._editor.marker.setSelection(min, max - min);
    }
  }

  onDoubleClick(event) {
    var position = this._getSourcePositionFromMouseEvent(event);
    var token = this._editor.getTokenFromPosition(position);
    this._editor.marker.setSelection(token.getPosition(), token.length);
  }

  _getSourcePositionFromMouseEvent(event) {
    var { left, top } = translateAbsoluteToRelativePoint(event, this.refs.editor);

    var tr = this._editor.textRuler;
    var lh = tr.calculateLineHeight();
    var i = 0;
    while((i + 1) * lh < top) i++;

    var line = this._editor.lines[i];
    var column = tr.convertPointToCharacterPosition(line.toString(), left)

    return line.getPosition() + column;
  }

  render() {

    var editor = this.getEditor({
      ...this.state,
      ...this.props,
      style: Object.assign({}, this.state.style, this.props.style || {})
    });

    var style = {
      ...editor.style,
      height: editor.textRuler.calculateLineHeight() * editor.lines.length
    }

    return <div
      ref='editor'
      style={style}
      data-mouse-trap={false}
      className={['m-text-editor', this.props.className].join(' ')}
      onDoubleClick={this.onDoubleClick.bind(this)}
      onMouseDown={this.onMouseDown.bind(this)}
      >

      <div className='m-text-editor--inner'>

        {
          editor.lines.map((line, i) => {
            return <LineComponent editor={editor} line={line} key={i} tokenComponentFactory={this.props.tokenComponentFactory} />
          })
        }

        { this.state.focus ? editor.marker.length > 0 ? <HighlightComponent marker={editor.marker} editor={editor} /> : <CaretComponent idle={this.state.idle} editor={editor} caret={editor.caret} /> : void 0 }
      </div>

      <input ref='hiddenInput' type='text'
             onKeyPress={this.onKey.bind(this)}
             onPaste={this.onPaste.bind(this)}
             onCopy={this.onCopy.bind(this)}
             onKeyDown={this.onKeyCommand.bind(this)}
             onFocus={this.onFocus.bind(this)}
             onBlur={this.onBlur.bind(this)} />
    </div>;
  }
}

export default TextEditorComponent;
