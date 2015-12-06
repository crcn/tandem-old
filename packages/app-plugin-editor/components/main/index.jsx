import React from 'react';
import Pane from 'component-pane';
import SidebarComponent from './sidebar';

class MainComponent extends React.Component {
    render() {
        return <div className='m-editor'>
          <SidebarComponent paneType='app' {...this.props} />
          <SidebarComponent paneType='symbol' {...this.props} />
        </div>;
    }
}

export default MainComponent;
