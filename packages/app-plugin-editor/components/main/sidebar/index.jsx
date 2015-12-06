import React from 'react';
import sift from 'sift';
import PaneContainerComponent from './pane-container';

/**
 * Right sidebar tools
 */

class SidebarComponent extends React.Component {
    render() {
        return <div className='m-sidebar'>
          {
            this.props.app.registry.filter(sift({ paneType: this.props.paneType })).map((entry) => {
              return <PaneContainerComponent entry={entry} key={entry.id} {...this.props} />
            })
          }
        </div>;
    }
}

export default SidebarComponent;
