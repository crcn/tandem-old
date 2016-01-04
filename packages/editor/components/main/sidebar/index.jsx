import './sidebar.scss';

import cx from 'classnames';
import React from 'react';
import Reference from 'common/reference';
import SideDragger from 'common/components/side-dragger';
import RegisteredComponent from 'common/components/registered';

/**
* Right sidebar tools
*/

class SidebarComponent extends React.Component {
  render() {

    var settingName           = this.props.position + 'SidebarPosition';
    var sidebarWidthReference = Reference.create(this.props.app.settings, settingName, (value) => {
      return Math.max(150, Math.min(value || 200, this.props.maxWidth));
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
  maxWidth: 250
};

export default SidebarComponent;
