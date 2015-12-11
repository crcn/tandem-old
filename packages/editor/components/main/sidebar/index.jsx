import './sidebar.scss';
import React from 'react';
import sift from 'sift';
import PaneContainerComponent from './pane-container';
import cx from 'classnames';
import SideDragger from 'common/components/side-dragger';
import Reference from 'common/reference';

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
        this.props.app.plugins.filter(sift({ paneType: this.props.paneType })).map((entry) => {
          return <PaneContainerComponent entry={entry} key={entry.id} {...this.props} />
        })
      }

      <SideDragger {...this.props} reference={sidebarWidthReference} position={this.props.position == 'left' ? 'right' : 'left'} />
    </div>;
  }
}

export default SidebarComponent;
