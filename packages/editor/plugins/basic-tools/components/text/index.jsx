import './index.scss';

import React from 'react';
import Reference from 'common/reference';
import TextInputComponent from 'common/components/inputs/text-input';

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
    console.log('blur');
    this.props.app.notifier.notify({
      type: 'textEditComplete'
    });
  }

  render() {
    var entity = this.props.entity;
    var zoom   = this.props.zoom;
    var cstyle = entity.getComputedStyle();

    var style = {
      position : 'absolute',
      left     : cstyle.left,
      top      : cstyle.top,
      zIndex   : 999
    };

    var inputStyle = Object.assign({}, entity.style);
    delete inputStyle['position'];
    delete inputStyle['left'];
    delete inputStyle['top'];

    return <div style={style} className='reset-all m-text-tool'>
      <TextInputComponent
        multiline={false}
        onKeyDown={this.onKeyDown.bind(this)}
        onBlur={this.onBlur.bind(this)}
        ref='input'
        style={inputStyle}
        reference={Reference.create(entity, 'value')} />
    </div>
  }
}

export default TextToolComponent;
