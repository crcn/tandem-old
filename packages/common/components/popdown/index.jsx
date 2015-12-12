import './index.scss';
import ArrowComponent from 'common/components/arrow';

import React from 'react';

class PopdownComponent extends React.Component {
  render() {
    return <div className={['m-popdown', this.props.className].join(' ')}>
      {
        this.props.showArrowBox !== false             ?
        <ArrowComponent styles={this.props.styles} /> :
        void 0
      }

      { this.props.children }
    </div>;
  }
}

export default PopdownComponent;
