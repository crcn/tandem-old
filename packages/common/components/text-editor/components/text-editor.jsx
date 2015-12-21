import './text-editor.scss';

import React from 'react';
import TextEditor from '../controllers/text-editor';
import TypeNotifier from 'common/notifiers/type';
import LineComponent from './line';
import CaretComponent from './caret';
import CollectionNotifier from 'common/notifiers/collection';

class TextEditorComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      focus : false,
      idle  : true
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

  componentWillReceiveProps(nextProps) {
    this.getEditor().setProperties(nextProps);
  }

  getEditor() {
    if (this._editor) return this._editor;

    this._editor = TextEditor.create({
      notifier: this.notifier,
      ...this.props
    });

    return this.getEditor();
  }

  onKey(event) {
    this.notifier.notify({
      type: 'input',
      text: String.fromCharCode(event.which)
    });
    event.stopPropagation();
    event.preventDefault();
  }

  onKeyCommand(event) {

    this.notifier.notify({
      type    : 'keyCommand',
      keyCode : event.keyCode,
      altKey  : event.altKey,
      ctrlKey : event.ctrlKey,
      preventDefault() {
        event.preventDefault();
      }
    });
  }

  onFocus(event) {
    this.setState({ focus: true });
  }

  onBlur(event) {
    this.setState({ focus: false });
  }

  render() {
    var editor = this.getEditor();

    return <div
      ref='editor'
      style={this.props.style}
      tabIndex='0'
      data-mouse-trap={false}
      className={['m-text-editor', this.props.className].join(' ')}
      onKeyPress={this.onKey.bind(this)}
      onKeyDown={this.onKeyCommand.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onBlur={this.onBlur.bind(this)}>

      { this.state.focus ? <CaretComponent idle={this.state.idle} editor={editor} caret={editor.caret} /> : void 0 }

      {
        editor.lines.map((line, i) => {
          return <LineComponent editor={editor} line={line} key={i} tokenComponentFactory={this.props.tokenComponentFactory} />
        })
      }
    </div>;
  }
}

export default TextEditorComponent;
