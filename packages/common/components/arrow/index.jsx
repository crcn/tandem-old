import './index.scss';

import React from 'react';
import { getStyle } from 'common/utils/component';

class ArrowComponent extends React.Component {
  render() {

    var style = getStyle(this.props, 'arrow', {
      left: '50%'
    });

    return <div className='arrow-box' style={style}>
      <span className='arrow-box--before'></span>
      <span className='arrow-box--after'></span>
    </div>;
  }
}

export default ArrowComponent;
