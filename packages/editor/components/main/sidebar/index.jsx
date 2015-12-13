import './sidebar.scss';

import React from 'react';
import cx from 'classnames';
import Reference from 'common/reference';
import SideDragger from 'common/components/side-dragger';
import PaneContainerComponent from './pane-container';

/**
* Right sidebar tools
*/

class SidebarComponent extends React.Component {
  render() {

    var settingName           = this.props.position + 'SidebarPosition';
    var sidebarWidthReference = Reference.create(this.props.app.settings, settingName, function(value) {
      return Math.max(150, Math.min(value || 200, 250));
    });

    var style = {
      width: sidebarWidthReference.getValue()
    };

    return <div style={style} className={['m-sidebar', this.props.position].join(' ')}>

      {
        this.props.app.plugins.query({
          paneType: this.props.paneType
      }).map((plugin) => {
          return <PaneContainerComponent plugin={plugin} key={plugin.id} {...this.props} />
        })
      }

      <SideDragger {...this.props} reference={sidebarWidthReference} position={this.props.position == 'left' ? 'right' : 'left'} />
    </div>;
  }
}

export default SidebarComponent;
