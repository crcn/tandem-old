import './index.scss';
import React from 'react';

class GroupAlignComponent extends React.Component {
  render() {

    // one or more items
    //if (this.props.selection.length <= 1) return null;

    var rect = this.props.selection.preview.getBoundingRect(true);

    var style = {
      left: rect.left + rect.width / 2,
      top : rect.top
    };

    return <div style={style} className='m-group-align-tool'>
      group align this stuff
    </div>
  }
}

export default GroupAlignComponent;
