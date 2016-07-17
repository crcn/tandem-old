import './sidebar.scss';

import cx from 'classnames';
import React from 'react';
import Reference from 'saffron-common/reference';
import SideDragger from 'saffron-common/components/side-dragger';
import RegisteredComponent from 'saffron-common/components/registered';

/**
* Right sidebar tools
*/


const MIN_SIDEBAR_WIDTH = 150;
const DEFAULT_SIDEBAR_WIDTH  = 250;

class SidebarComponent extends React.Component {
  render() {

    var settingName           = this.props.position + 'SidebarPosition';
    var sidebarWidthReference = Reference.create(this.props.app.settings, settingName, (value) => {
      return Math.max(MIN_SIDEBAR_WIDTH, Math.min(value || DEFAULT_SIDEBAR_WIDTH, this.props.maxWidth));
    });

    var style = {
      width: sidebarWidthReference.getValue()
    };

    return <div style={style} className={['m-sidebar', this.props.position].join(' ')}>
      <RegisteredComponent {...this.props} />
      <SideDragger {...this.props} reference={sidebarWidthReference} position={this.props.position == 'left' ? 'right' : 'left'} />
    </div>;
  }
}

SidebarComponent.defaultProps = {
  maxWidth: DEFAULT_SIDEBAR_WIDTH
};

export default SidebarComponent;
