import './index.scss';

import React from 'react';
import ArrowComponent from 'saffron-common/components/arrow';

class PopdownComponent extends React.Component {
  render() {
    return <div className={['m-popdown', this.props.className].join(' ')}>
      {
        this.props.showArrow !== false                ?
        <ArrowComponent styles={this.props.styles} /> :
        void 0
      }

      { this.props.children }
    </div>;
  }
}

PopdownComponent.defaultProps = {
  showArrow: false
};

export default PopdownComponent;
