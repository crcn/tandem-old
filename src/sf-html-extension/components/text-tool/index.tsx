import './index.scss';

import * as React from 'react';
// import Reference from 'sf-common/reference';
import WYSIWYGEditor from 'sf-front-end/components/wysiwyg';

class TextToolComponent extends React.Component<any, any> {

  componentDidMount() {
    (this.refs as any).input.focus();
    (this.refs as any).input.select();
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
    var cstyle    = selection.preview.getBoundingRect(false);

    var style = {
      position : 'absolute',
      left     : cstyle.left,
      top      : cstyle.top,
      zoom     : this.props.zoom,
      zIndex   : 999
    };

    var element = this.props.selection[0].preview.displayObject.element;

    var cstyle2 = window.getComputedStyle(element);

    var inputStyle = {
      width         : cstyle.width,
      height        : cstyle.height,
      fontSize      : cstyle2.fontSize,
      fontFamily    : cstyle2.fontFamily,
      fontWeight    : cstyle2.fontWeight,
      letterSpacing : cstyle2.letterSpacing,
      lineHeight    : cstyle2.lineHeight,
      overflow      : 'show'
    };

    return <div style={style} className='reset-all m-text-tool'>
      <WYSIWYGEditor
        multiline={false}
        onKeyDown={this.onKeyDown.bind(this)}
        onBlur={this.onBlur.bind(this)}
        ref='input'
        style={inputStyle}
        reference={null} />
    </div>
  }
}

export default TextToolComponent;
