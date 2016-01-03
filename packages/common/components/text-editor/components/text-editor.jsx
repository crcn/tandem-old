import './text-editor.scss';

import React from 'react';
import TextEditor from '../controllers/text-editor';
import TypeNotifier from 'common/notifiers/type';
import LineComponent from './line';
import CaretComponent from './caret';
import CollectionNotifier from 'common/notifiers/collection';
import HighlightComponent from './highlight';

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
    this.notifier.notify({
      type: 'input',
      text: String.fromCharCode(event.which),
      preventDefault() {
        event.preventDefault();
      }
    });
  }

  onKeyCommand(event) {

    this.notifier.notify({
      type    : 'keyCommand',
      keyCode : event.keyCode,
      altKey  : event.altKey,
      ctrlKey : event.ctrlKey,
      cmdKey  : event.cmdKey,
      metaKey : event.metaKey,
      preventDefault() {
        event.preventDefault();
      }
    });

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  focus() {
    this.refs.editor.focus();
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
    console.log('paste');
  }

  render() {
    var editor = this.getEditor({
      ...this.state,
      ...this.props,
      style: Object.assign({}, this.state.style, this.props.style || {})
    });

    return <div
      ref='editor'
      style={editor.style}
      tabIndex='0'
      data-mouse-trap={false}
      className={['m-text-editor', this.props.className].join(' ')}
      onKeyPress={this.onKey.bind(this)}
      onPaste={this.onPaste.bind(this)}
      onKeyDown={this.onKeyCommand.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onBlur={this.onBlur.bind(this)}>

      <div className='m-text-editor--inner'>

        {
          editor.lines.map((line, i) => {
            return <LineComponent editor={editor} line={line} key={i} tokenComponentFactory={this.props.tokenComponentFactory} />
          })
        }

        { this.state.focus ? editor.marker.length > 0 ? <HighlightComponent marker={editor.marker} editor={editor} /> : <CaretComponent idle={this.state.idle} editor={editor} caret={editor.caret} /> : void 0 }
      </div>
    </div>;
  }
}

export default TextEditorComponent;
