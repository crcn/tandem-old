import './index.scss';

import React from 'react';
import Reference from 'common/reference';
import TextInputComponent from 'common/components/inputs/text';

class TextToolComponent extends React.Component {

  componentDidMount() {
    this.refs.input.focus();
    this.refs.input.select();
  }

  onKeyDown(event) {

    // TODO - want to support newline characters at some point
    if (event.keyCode === 13) {
      event.preventDefault();
      this._complete();
    }
  }

  onBlur(event) {
    this._complete();
  }

  _complete() {
    this.props.app.notifier.notify({
      type: 'textEditComplete'
    });
  }

  render() {
    var selection = this.props.selection;
    var zoom      = this.props.zoom;
    var cstyle    = selection.preview.getStyle();

    var style = {
      position : 'absolute',
      left     : cstyle.left,
      top      : cstyle.top,
      zoom     : this.props.zoom,
      zIndex   : 999
    };

    var inputStyle = Object.assign({}, selection.getStyle());
    delete inputStyle['position'];
    delete inputStyle['left'];
    delete inputStyle['top'];
    delete inputStyle['background'];

    return <div style={style} className='reset-all m-text-tool'>
      <TextInputComponent
        multiline={false}
        onKeyDown={this.onKeyDown.bind(this)}
        onBlur={this.onBlur.bind(this)}
        ref='input'
        style={inputStyle}
        reference={Reference.create(selection, 'value')} />
    </div>
  }
}

export default TextToolComponent;
