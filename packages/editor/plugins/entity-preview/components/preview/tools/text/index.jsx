import './index.scss';

import React from 'react';
import TextInputComponent from 'common/components/inputs/text-input';
import Reference from 'common/reference';

class TextToolComponent extends React.Component {
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
      <TextInputComponent style={inputStyle} reference={Reference.create(entity, 'value')} />
    </div>
  }
}

export default TextToolComponent;
